import cryptojs from 'crypto-js';
import { SECRET_KEY, NODES } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { VM } from '$lib/types';

const nodes = NODES.split(',');

export const load: PageServerLoad = async ({ locals }) => {
  let vms: VM[] = [];
  let offline: string[] = [];
  let error: string = '';

  try {
    if (!locals.ticket || !locals.user || !locals.domain) {
      return {};
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
    };

    for (const node of nodes) {
      try {
        const containers = await fetch(`https://${locals.domain}/api2/json/nodes/${node}/lxc`, {
          method: 'GET',
          headers: headers,
        });
        const lxcs = await containers.json();
        const machines = await fetch(`https://${locals.domain}/api2/json/nodes/${node}/qemu`, {
          method: 'GET',
          headers: headers,
        });
        const qemus = await machines.json();

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
