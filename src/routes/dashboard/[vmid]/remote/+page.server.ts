import cryptojs from 'crypto-js';
import config from '$lib/server/config';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  let link: string = '';
  const { vmid } = params;
  const param = { vmid, node: url.searchParams.get('node'), type: url.searchParams.get('type') };

  if (!locals.ticket || !locals.user || !locals.domain || !locals.csrf) {
    return {};
  }

  try {
    const vncproxy = await fetch(
      `https://${locals.domain}/api2/json/nodes/${param.node}/${param.type}/${vmid}/vncproxy?websocket=1`,
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
      return {
        error: 'Failed to connect to machine.',
        param,
      };
    }

    // might not be required?
    await fetch(
      `https://${locals.domain}/api2/json/nodes/${param.node}/${param.type}/${vmid}/vncwebsocket?port=${response.data.port}&vncticket=${encodeURIComponent(response.data.ticket)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8)}`,
          CSRFPreventionToken: locals.csrf,
        },
      }
    );

    if (param.type == 'lxc') {
      // xterm for lxc
      link = `https://${locals.domain}/?node=${param.node}&port=${response.data.port}&console=lxc&vmid=${vmid}&xtermjs=1&cmd=&vncticket=${encodeURIComponent(response.data.ticket)}&PVEAuthCookie=${encodeURIComponent(cryptojs.AES.decrypt(locals.ticket, config.SECRET_KEY).toString(cryptojs.enc.Utf8))}&CSRFPreventionToken=${encodeURIComponent(locals.csrf)}`;
    } else if (param.type == 'qemu') {
      // novnc for vm
      // see https://forum.proxmox.com/threads/how-to-set-up-novnc-on-a-web-application.123701/
      link = `https://${locals.domain}/?node=${param.node}&console=kvm&novnc=1&resize=1&vmid=${vmid}&path=api2/json/nodes/${param.node}/qemu/${vmid}/vncwebsocket/port/${response.data.port}/vncticket/${encodeURIComponent(response.data.ticket)}`;
    }
  } catch (error) {
    return {
      error: 'Failed to connect to machine ' + error,
      param,
    };
  }

  return {
    locals,
    param,
    link,
  };
};
