import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import cryptojs from 'crypto-js';
import { getAuthCookies, clearAuthCookies } from './lib/cookies';
import { SECRET_KEY } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;

  const { ticket, user, token, domain } = getAuthCookies(cookies);

  let isLoggedIn = false;
  const publicRoutes = ['/'];
  const isPublicRoute = publicRoutes.includes(url.pathname);

  try {
    if (ticket && user && token && domain) {
      const auth = await fetch(`https://${domain}/api2/json/access/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: cryptojs.AES.decrypt(ticket, SECRET_KEY).toString(cryptojs.enc.Utf8),
        }),
      });
      isLoggedIn = auth.ok;
    }
  } catch {
    clearAuthCookies(cookies);
    return redirect(303, '/');
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
