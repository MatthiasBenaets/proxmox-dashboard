import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import cryptojs from 'crypto-js';
import { getAuthCookies, clearAuthCookies } from '$lib/cookies';
import config from '$lib/server/config';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;

  const { ticket, user, token, domain, csrf } = getAuthCookies(cookies);

  let isLoggedIn = false;
  const publicRoutes = ['/login'];
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
          password: cryptojs.AES.decrypt(ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8),
        }),
      });
      isLoggedIn = auth.ok;
    }
  } catch {
    clearAuthCookies(cookies);
    return redirect(303, '/login');
  }

  if (!isLoggedIn) {
    clearAuthCookies(cookies);
    if (!isPublicRoute) {
      return redirect(303, '/login');
    }
    return resolve(event);
  } else {
    event.locals = {
      user,
      token,
      domain,
      ticket,
      csrf,
    };

    if (url.pathname === '/' || url.pathname === '/login') {
      return redirect(303, '/dashboard');
    }

    return resolve(event);
  }
};
