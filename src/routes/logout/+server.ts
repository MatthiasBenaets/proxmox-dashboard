import { cookie } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, cookies }) => {
  cookie.clearAll(cookies, url.hostname);
  return redirect(303, '/login');
};
