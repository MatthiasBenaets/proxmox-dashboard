import cryptojs from 'crypto-js';
import config from '$lib/server/config';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { VM } from '$lib/types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { vmid, node, type } = await request.json();
  let vm: VM | null = null;

  if (!locals.ticket || !locals.user || !locals.domain) {
    return json({ error: 'Not logged in.' }, { status: 401 });
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
    };

    const status = await fetch(
      `https://${locals.domain}/api2/json/nodes/${node}/${type}/${vmid}/status/current`,
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
