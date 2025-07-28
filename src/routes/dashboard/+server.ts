import { json } from '@sveltejs/kit';
import { validateAuth } from '$lib/server/auth';
import { pveFetch } from '$lib/server/fetch';
import { currentVMs } from '$lib/vms.svelte';
import type { RequestHandler } from './$types';
import type { VM } from '$lib/types';

export const GET: RequestHandler = async ({ locals }) => {
  let nodes: string[] = [];
  let vms: VM[] = [];
  let offline: string[] = [];
  let error = '';

  try {
    const auth = validateAuth(locals);
    if (!auth.valid) return json({ error: auth.message }, { status: 401 });

    if (locals.PVENodes) {
      nodes = locals.PVENodes.split(',');
    } else {
      return json({ error: 'No nodes set/found' }, { status: 500 });
    }

    for (const node of nodes) {
      try {
        const containers = await pveFetch(`/api2/json/nodes/${node}/lxc`, 'GET', locals);
        const lxcs = await containers.json();
        for (const lxc of lxcs.data) {
          lxc.node = node;
        }

        const machines = await pveFetch(`/api2/json/nodes/${node}/qemu`, 'GET', locals);
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
    return json({ error: 'Failed to fetch data from Proxmox' }, { status: 500 });
  }

  return json({ vms, error }, { status: 201 });
};
