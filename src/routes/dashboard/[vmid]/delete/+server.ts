import { json } from '@sveltejs/kit';
import { validateAuth } from '$lib/server/auth';
import { pveFetch } from '$lib/server/fetch';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, request }) => {
  const { node, vmid, type } = await request.json();

  const auth = validateAuth(locals);
  if (!auth.valid) return json({ error: auth.message }, { status: 401 });

  try {
    const del = await pveFetch(
      `/api2/json/nodes/${node}/${type}/${vmid}?force=1&purge=1`,
      'DELETE',
      locals
    );

    if (!del.ok) {
      return json(
        { error: 'Failed to delete the machine. ' + del.statusText },
        { status: del.status }
      );
    }
  } catch (error) {
    return json({ error: `Failed to delet the machine: ` + error }, { status: 500 });
  }

  return json({ message: 'Successfully deleted the machine.' }, { status: 201 });
};
