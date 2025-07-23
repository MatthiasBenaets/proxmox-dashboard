import type { Cookies } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

const cookieOptions: CookieSerializeOptions & { path: string } = {
  path: '/',
  sameSite: 'strict' as const,
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
};

export function getCookie(cookies: Cookies, keys: string[]): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const key of keys) {
    result[key] = cookies.get(key);
  }
  return result;
}

export function setCookie(
  cookies: Cookies,
  key: string,
  value: string,
  options?: CookieSerializeOptions & { path: string }
) {
  cookies.set(key, value, options || cookieOptions);
}

export function clearCookie(cookies: Cookies, keys: string[]) {
  for (const key of keys) {
    cookies.delete(key, { path: '/' });
  }
}

export function clearCookies(cookies: Cookies) {
  for (const cookie of cookies.getAll()) {
    cookies.delete(cookie.name, { path: '/' });
  }
}
