import { getBaseDomain } from '$lib/utils';
import type { Cookies } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

const cookieOptions: CookieSerializeOptions & { path: string } = {
  path: '/',
  sameSite: 'strict' as const,
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
};

export const cookie = {
  get(cookies: Cookies, keys: string[]) {
    const result: Record<string, string | undefined> = {};
    for (const key of keys) {
      result[key] = cookies.get(key);
    }
    return result;
  },

  set(
    cookies: Cookies,
    key: string,
    value: string,
    options?: CookieSerializeOptions & { path: string }
  ) {
    cookies.set(key, value, options || cookieOptions);
  },

  clear(cookies: Cookies, keys: string[]) {
    for (const key of keys) {
      cookies.delete(key, { path: '/' });
    }
  },

  clearAll(cookies: Cookies, host?: string) {
    for (const cookie of cookies.getAll()) {
      cookies.delete(cookie.name, { path: '/' });
    }
    if (host) {
      cookies.delete('PVEAuthCookie', {
        domain: '.' + getBaseDomain(host),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      cookies.delete('PVECSRFPreventionToken', {
        domain: '.' + getBaseDomain(host),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }
  },
};
