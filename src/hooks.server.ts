import { redirect } from '@sveltejs/kit';
import { cookie } from '$lib/cookies';
import { getBaseDomain } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;
  const {
    PVEDomain,
    PVEUser,
    PVERealm,
    PVEAPIToken,
    PVENodes,
    PVEAuthCookie,
    PVECSRFPreventionToken,
  } = cookie.get(cookies, [
    'PVEDomain',
    'PVEUser',
    'PVERealm',
    'PVEAPIToken',
    'PVENodes',
    'PVEAuthCookie',
    'PVECSRFPreventionToken',
  ]);

  let isLoggedIn = false;
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(url.pathname);

  if (PVEAuthCookie && PVEUser && PVEAPIToken && PVEDomain && PVERealm) {
    try {
      const auth = await fetch(`https://${PVEDomain}/api2/json/access/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: PVEUser + '@' + PVERealm,
          password: PVEAuthCookie,
        }),
      });
      const response = await auth.json();

      if (auth.ok) {
        cookie.set(cookies, 'PVEAuthCookie', response.data.ticket, {
          domain: getBaseDomain(event.url.hostname),
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 2,
        });
        cookie.set(cookies, 'PVECSRFPreventionToken', response.data.CSRFPreventionToken, {
          domain: getBaseDomain(event.url.hostname),
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 2,
        });
      }

      isLoggedIn = auth.ok;
    } catch {
      cookie.clearAll(cookies);
      return redirect(303, '/login');
    }
  }

  if (!isLoggedIn) {
    cookie.clearAll(cookies);
    if (!isPublicRoute) {
      return redirect(303, '/login');
    }
    return resolve(event);
  }

  event.locals = {
    PVEUser,
    PVEAPIToken,
    PVEDomain,
    PVEAuthCookie,
    PVECSRFPreventionToken,
    PVERealm,
    PVENodes,
  };

  if (url.pathname === '/' || url.pathname === '/login') {
    return redirect(303, '/dashboard');
  }

  return resolve(event);
};
