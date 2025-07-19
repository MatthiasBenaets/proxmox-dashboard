import cryptojs from 'crypto-js';
import config from '$lib/server/config';
import type { PageServerLoad } from './$types';
import type { VM } from '$lib/types';

const nodes = config.NODES.split(',');

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
      Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
    };

    for (const node of nodes) {
      try {
        const containers = await fetch(`https://${locals.domain}/api2/json/nodes/${node}/lxc`, {
          method: 'GET',
          headers: headers,
        });
        const lxcs = await containers.json();
        for (const lxc of lxcs.data) {
          lxc.node = node;
        }
        const machines = await fetch(`https://${locals.domain}/api2/json/nodes/${node}/qemu`, {
          method: 'GET',
          headers: headers,
        });
        const qemus = await machines.json();
        for (const qemu of qemus.data) {
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
