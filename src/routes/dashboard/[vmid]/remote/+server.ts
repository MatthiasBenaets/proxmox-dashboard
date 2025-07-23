import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  let link: string = '';
  const { vmid, node, type } = await request.json();

  console.log(locals);
  if (
    !locals.PVEAuthCookie ||
    !locals.PVEUser ||
    !locals.PVEDomain ||
    !locals.PVECSRFPreventionToken
  ) {
    return json(
      {
        error: 'Not logged in.',
      },
      { status: 401 }
    );
  }

  try {
    const vncproxy = await fetch(
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/${type}/${vmid}/vncproxy?websocket=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
          CSRFPreventionToken: locals.PVECSRFPreventionToken,
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
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/${type}/${vmid}/vncwebsocket?port=${response.data.port}&vncticket=${encodeURIComponent(response.data.ticket)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
          CSRFPreventionToken: locals.PVECSRFPreventionToken,
        },
      }
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
