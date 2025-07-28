import { json } from '@sveltejs/kit';
import { validateAuth } from '$lib/server/auth';
import { pveFetch } from '$lib/server/fetch';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { vmid, node } = await request.json();

  const auth = validateAuth(locals);
  if (!auth.valid) return json({ error: auth.message }, { status: 401 });

  try {
    const tasks = await pveFetch(`/api2/json/nodes/${node}/tasks?vmid=${vmid}`, 'GET', locals);
    const response = await tasks.json();

    if (!tasks.ok) {
      return json(
        { error: 'Failed to connect to machine. ' + tasks.statusText },
        { status: tasks.status }
      );
    }

    return json({ tasks: response.data }, { status: 200 });
  } catch (error) {
    return json({ error: 'Failed to connect to machine ' + error }, { status: 500 });
  }
};
