import { json } from '@sveltejs/kit';
import { currentVMs } from '$lib/vms.svelte';
import type { RequestHandler } from './$types';
import type { VM } from '$lib/types';

export const GET: RequestHandler = async ({ locals }) => {
  let vms: VM[] = [];
  let offline: string[] = [];
  let error = '';

  try {
    if (!locals.PVEAuthCookie || !locals.PVEUser || !locals.PVEDomain || !locals.PVENodes) {
      return json(
        {
          error: 'Unable to authenticate. Please log out and in again.',
        },
        { status: 401 }
      );
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
    };

    const nodes = locals.PVENodes.split(',');

    for (const node of nodes) {
      try {
        const containers = await fetch(`https://${locals.PVEDomain}/api2/json/nodes/${node}/lxc`, {
          method: 'GET',
          headers: headers,
        });
        const lxcs = await containers.json();
        for (const lxc of lxcs.data) {
          lxc.node = node;
        }

        const machines = await fetch(`https://${locals.PVEDomain}/api2/json/nodes/${node}/qemu`, {
          method: 'GET',
          headers: headers,
        });
        const qemus = await machines.json();
        for (const qemu of qemus.data) {
          qemu.type = 'qemu';
          qemu.node = node;
        }

        vms = [...vms, ...lxcs.data, ...qemus.data];
        currentVMs.set(vms);
      } catch {
        offline = [...offline, node];
        error = `Failed to fetch data from node: ${offline}`;
      }
    }
  } catch {
    return json(
      { error: 'Failed to fetch data from Proxmox' },
      {
        status: 500,
      }
    );
  }

  return json({ vms, error }, { status: 201 });
};
