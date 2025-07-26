import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { action, node, vmid, type } = await request.json();

  console.log(action, node, vmid);
  if (
    !locals.PVEAuthCookie ||
    !locals.PVEUser ||
    !locals.PVEDomain ||
    !locals.PVECSRFPreventionToken
  ) {
    return json(
      {
        error: 'Unable to authenticate. Please log out and in again.',
      },
      { status: 401 }
    );
  }

  try {
    const status = await fetch(
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/${type}/${vmid}/status/${action}`,
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
    // const response = await status.json();

    if (!status.ok) {
      return json(
        {
          error: 'Failed to connect to machine. ' + status.statusText,
        },
        { status: status.status }
      );
    }
  } catch (error) {
    return json(
      {
        error: `Failed to ${action} the machine:  ` + error,
      },
      { status: 500 }
    );
  }

  return json({}, { status: 201 });
};
