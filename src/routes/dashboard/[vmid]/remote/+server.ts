import { json } from '@sveltejs/kit';
import { validateAuth } from '$lib/server/auth';
import { pveFetch } from '$lib/server/fetch';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  let link: string = '';
  const { vmid, node, type } = await request.json();

  const auth = validateAuth(locals);
  if (!auth.valid) return json({ error: auth.message }, { status: 401 });

  try {
    const vncproxy = await pveFetch(
      `/api2/json/nodes/${node}/${type}/${vmid}/vncproxy?websocket=1`,
      'POST',
      locals
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
    await pveFetch(
      `/api2/json/nodes/${node}/${type}/${vmid}/vncwebsocket?port=${response.data.port}&vncticket=${encodeURIComponent(response.data.ticket)}`,
      'GET',
      locals
    );

    if (type == 'lxc') {
      // xterm for lxc
      link = `https://${locals.PVEDomain}/?node=${node}&port=${response.data.port}&console=lxc&vmid=${vmid}&xtermjs=1&cmd=&vncticket=${encodeURIComponent(response.data.ticket)}&PVEAuthCookie=${encodeURIComponent(locals.PVEAuthCookie)}&CSRFPreventionToken=${encodeURIComponent(locals.PVECSRFPreventionToken)}`;
    } else if (type == 'qemu') {
      // novnc for vm
      // see https://forum.proxmox.com/threads/how-to-set-up-novnc-on-a-web-application.123701/
      link = `https://${locals.PVEDomain}/?node=${node}&console=kvm&novnc=1&resize=1&vmid=${vmid}&path=api2/json/nodes/${node}/qemu/${vmid}/vncwebsocket/port/${response.data.port}/vncticket/${encodeURIComponent(response.data.ticket)}`;
    }
  } catch (error) {
    return json({ error: 'Failed to connect to machine ' + error }, { status: 500 });
  }

  return json({ link }, { status: 201 });
};
