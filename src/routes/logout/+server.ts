import { clearCookies } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, cookies }) => {
  clearCookies(cookies, url.hostname);
  return redirect(303, '/login');
};
