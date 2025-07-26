import { json } from '@sveltejs/kit';
import { currentVMs } from '$lib/vms.svelte';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { node, vmid, type } = await request.json();

  if (
    !locals.PVEAuthCookie ||
    !locals.PVEUser ||
    !locals.PVEDomain ||
    !locals.PVECSRFPreventionToken
  ) {
    return json(
      {
        error: 'Unable to authenticate. Please log out and in again.',
      },
      { status: 401 }
    );
  }

  const maxId = Math.max(...currentVMs.get().map((vm) => vm.vmid));

  try {
    const clone = await fetch(
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/${type}/${vmid}/clone?newid=${maxId + 1}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
          CSRFPreventionToken: locals.PVECSRFPreventionToken,
        },
        body: JSON.stringify({}),
      }
    );

    if (!clone.ok) {
      return json(
        {
          error: 'Failed to clone the machine. ' + clone.statusText,
        },
        { status: clone.status }
      );
    }
  } catch (error) {
    return json(
      {
        error: `Failed to clone the machine:  ` + error,
      },
      { status: 500 }
    );
  }

  return json(
    { vmid: maxId + 1, link: `/dashboard?vmid=${maxId + 1}&node=${node}&type=${type}` },
    { status: 201 }
  );
};
