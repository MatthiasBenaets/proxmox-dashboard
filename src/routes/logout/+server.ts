import { clearAuthCookies } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  clearAuthCookies(cookies);
  return redirect(303, '/login');
}
