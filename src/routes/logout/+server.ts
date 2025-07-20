import { clearAuthCookies } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  clearAuthCookies(cookies);
  console.log('test');
  return redirect(303, '/login');
}
