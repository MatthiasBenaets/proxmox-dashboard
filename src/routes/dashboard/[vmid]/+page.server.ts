import cryptojs from 'crypto-js';
import config from '$lib/server/config';
import type { PageServerLoad } from './$types';
import type { VM } from '$lib/types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  let vm: VM | null = null;
  const { vmid } = params;
  const param = { vmid, node: url.searchParams.get('node'), type: url.searchParams.get('type') };

  try {
    if (!locals.ticket || !locals.user || !locals.domain) {
      return {};
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
    };

    const status = await fetch(
      `https://${locals.domain}/api2/json/nodes/${param.node}/${param.type}/${vmid}/status/current`,
      {
        method: 'GET',
        headers: headers,
      }
    );

    if (!status.ok) {
      return {
        error: 'Failed to fetch data from machine.',
      };
    }

    const response = await status.json();
    vm = response.data;
  } catch (error) {
    return {
      error: 'Failed to fetch data from Proxmox: ' + error,
    };
  }

  return {
    locals,
    vm,
    param,
  };
};
