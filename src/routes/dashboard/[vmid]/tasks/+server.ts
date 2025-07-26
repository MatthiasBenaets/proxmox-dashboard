import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { vmid, node } = await request.json();

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
    const tasks = await fetch(
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/tasks?vmid=${vmid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
          CSRFPreventionToken: locals.PVECSRFPreventionToken,
        },
      }
    );
    const response = await tasks.json();

    if (!tasks.ok) {
      return json(
        {
          error: 'Failed to connect to machine. ' + tasks.statusText,
        },
        { status: tasks.status }
      );
    }

    return json({ tasks: response.data }, { status: 200 });
  } catch (error) {
    return json(
      {
        error: 'Failed to connect to machine ' + error,
      },
      { status: 500 }
    );
  }
};
