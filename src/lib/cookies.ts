import type { Cookies } from '@sveltejs/kit';

const cookieOptions = {
  path: '/',
  sameSite: 'strict' as const,
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
};

const authKeys = ['domain', 'user', 'token', 'ticket', 'csrf'];

export function getAuthCookies(cookies: Cookies): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const key of authKeys) {
    result[key] = cookies.get(key);
  }
  return result;
}

export function setAuthCookies(cookies: Cookies, values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    if (authKeys.includes(key)) {
      cookies.set(key, value, cookieOptions);
    }
  }
}

export function clearAuthCookies(cookies: Cookies) {
  for (const key of authKeys) {
    cookies.delete(key, { path: '/' });
  }
}
