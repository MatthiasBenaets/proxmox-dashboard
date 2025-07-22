import cryptojs from 'crypto-js';
import config from '$lib/server/config';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  let link: string = '';
  const { vmid, node, type } = await request.json();

  if (!locals.ticket || !locals.user || !locals.domain || !locals.csrf) {
    return json(
      {
        error: 'Not logged in.',
      },
      { status: 401 }
    );
  }

  try {
    const vncproxy = await fetch(
      `https://${locals.domain}/api2/json/nodes/${node}/${type}/${vmid}/vncproxy?websocket=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
          CSRFPreventionToken: locals.csrf,
        },
        body: JSON.stringify({}),
      }
    );
    const response = await vncproxy.json();

    if (!vncproxy.ok) {
      return json(
        {
          error: 'Failed to connect to machine. ' + vncproxy.statusText,
        },
        { status: vncproxy.status }
      );
    }

    // might not be required?
    await fetch(
      `https://${locals.domain}/api2/json/nodes/${node}/${type}/${vmid}/vncwebsocket?port=${response.data.port}&vncticket=${encodeURIComponent(response.data.ticket)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
          CSRFPreventionToken: locals.csrf,
        },
      }
    );

    if (type == 'lxc') {
      // xterm for lxc
      link = `https://${locals.domain}/?node=${node}&port=${response.data.port}&console=lxc&vmid=${vmid}&xtermjs=1&cmd=&vncticket=${encodeURIComponent(response.data.ticket)}&PVEAuthCookie=${encodeURIComponent(cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8))}&CSRFPreventionToken=${encodeURIComponent(locals.csrf)}`;
    } else if (type == 'qemu') {
      // novnc for vm
      // see https://forum.proxmox.com/threads/how-to-set-up-novnc-on-a-web-application.123701/
      link = `https://${locals.domain}/?node=${node}&console=kvm&novnc=1&resize=1&vmid=${vmid}&path=api2/json/nodes/${node}/qemu/${vmid}/vncwebsocket/port/${response.data.port}/vncticket/${encodeURIComponent(response.data.ticket)}`;
    }
  } catch (error) {
    return json(
      {
        error: 'Failed to connect to machine ' + error,
      },
      { status: 500 }
    );
  }

  return json(
    {
      link,
    },
    { status: 201 }
  );
};
