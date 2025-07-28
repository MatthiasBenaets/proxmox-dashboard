import { json } from '@sveltejs/kit';
import { validateAuth } from '$lib/server/auth';
import { pveFetch } from '$lib/server/fetch';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { action, node, vmid, type } = await request.json();

  const auth = validateAuth(locals);
  if (!auth.valid) return json({ error: auth.message }, { status: 401 });

  try {
    const status = await pveFetch(
      `/api2/json/nodes/${node}/${type}/${vmid}/status/${action}`,
      'POST',
      locals
    );
    // const response = await status.json();

    if (!status.ok) {
      return json(
        { error: 'Failed to connect to machine. ' + status.statusText },
        { status: status.status }
      );
    }
  } catch (error) {
    return json({ error: `Failed to ${action} the machine:  ` + error }, { status: 500 });
  }

  return json({}, { status: 201 });
};
