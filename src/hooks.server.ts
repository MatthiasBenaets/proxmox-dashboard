import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getAuthCookies, clearAuthCookies } from './lib/cookies';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;

  const { ticket, user, token, domain } = getAuthCookies(cookies);

  let isLoggedIn = false;
  const publicRoutes = ['/'];
  const isPublicRoute = publicRoutes.includes(url.pathname);

  if (ticket && user && token && domain) {
    const auth = await fetch(`https://${domain}/api2/json/access/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user,
        password: ticket,
      }),
    });
    console.log(auth);
    isLoggedIn = auth.ok;
  }

  if (!isLoggedIn) {
    clearAuthCookies(cookies);
    if (!isPublicRoute) {
      return redirect(303, '/');
    }
    return resolve(event);
  } else {
    event.locals = {
      user,
      token,
      domain,
      ticket,
    };
    return resolve(event);
  }
};
