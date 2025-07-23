import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getCookie, clearCookies } from '$lib/cookies';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;

  const { PVEAuthCookie, PVEUser, PVEAPIToken, PVEDomain, PVECSRFPreventionToken } = getCookie(
    cookies,
    ['PVEAuthCookie', 'PVEUser', 'PVEAPIToken', 'PVEDomain', 'PVECSRFPreventionToken']
  );

  let isLoggedIn = false;
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(url.pathname);

  try {
    if (PVEAuthCookie && PVEUser && PVEAPIToken && PVEDomain) {
      const auth = await fetch(`https://${PVEDomain}/api2/json/access/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: PVEUser,
          password: PVEAuthCookie,
        }),
      });
      isLoggedIn = auth.ok;
    }
  } catch {
    clearCookies(cookies);
    return redirect(303, '/login');
  }

  if (!isLoggedIn) {
    clearCookies(cookies);
    if (!isPublicRoute) {
      return redirect(303, '/login');
    }
    return resolve(event);
  } else {
    event.locals = {
      PVEUser,
      PVEAPIToken,
      PVEDomain,
      PVEAuthCookie,
      PVECSRFPreventionToken,
    };

    if (url.pathname === '/' || url.pathname === '/login') {
      return redirect(303, '/dashboard');
    }

    return resolve(event);
  }
};
