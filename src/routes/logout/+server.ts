import { clearCookies } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  clearCookies(cookies);
  return redirect(303, '/login');
};
