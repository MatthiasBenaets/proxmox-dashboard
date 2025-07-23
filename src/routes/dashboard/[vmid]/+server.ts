import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { VM } from '$lib/types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { vmid, node, type } = await request.json();
  let vm: VM | null = null;

  if (!locals.PVEAuthCookie || !locals.PVEUser || !locals.PVEDomain) {
    return json({ error: 'Not logged in.' }, { status: 401 });
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
    };

    const status = await fetch(
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/${type}/${vmid}/status/current`,
      {
        method: 'GET',
        headers: headers,
      }
    );

    if (!status.ok) {
      return json(
        { error: 'Failed to fetch data from Proxmox. ' + status.statusText },
        { status: status.status }
      );
    }

    const response = await status.json();
    vm = response.data;
  } catch (error) {
    return json(
      {
        error: 'Failed to fetch data from Proxmox: ' + error,
      },
      { status: 500 }
    );
  }

  return json({ vm }, { status: 200 });
};
