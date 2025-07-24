import type { PageServerLoad } from './$types';
import type { VM } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
  let vms: VM[] = [];
  let offline: string[] = [];
  let error: string = '';

  try {
    if (!locals.PVEAuthCookie || !locals.PVEUser || !locals.PVEDomain || !locals.PVENodes) {
      return {
        error: 'Unable to authenticate. Please log out and in again.',
      };
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
      } catch {
        offline = [...offline, node];
        error = `Failed to fetch data from node: ${offline} `;
        continue;
      }
    }
  } catch {
    return {
      error: 'Failed to fetch data from Proxmox',
      locals,
      vms,
    };
  }

  return {
    error: error,
    locals,
    vms,
  };
};
