import { json } from '@sveltejs/kit';
import { currentVMs } from '$lib/vms.svelte';
import { validateAuth } from '$lib/server/auth';
import { pveFetch } from '$lib/server/fetch';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { node, vmid, type, name } = await request.json();

  const auth = validateAuth(locals);
  if (!auth.valid) return json({ error: auth.message }, { status: 401 });

  const maxId = Math.max(...currentVMs.get().map((vm) => vm.vmid));

  try {
    const clone = await pveFetch(
      `/api2/json/nodes/${node}/${type}/${vmid}/clone?newid=${maxId + 1}&hostname=${name}`,
      'POST',
      locals
    );

    if (!clone.ok) {
      return json(
        { error: 'Failed to clone the machine. ' + clone.statusText },
        { status: clone.status }
      );
    }
  } catch (error) {
    return json({ error: `Failed to clone the machine:  ` + error }, { status: 500 });
  }

  return json(
    { vmid: maxId + 1, link: `/dashboard?vmid=${maxId + 1}&node=${node}&type=${type}` },
    { status: 201 }
  );
};
