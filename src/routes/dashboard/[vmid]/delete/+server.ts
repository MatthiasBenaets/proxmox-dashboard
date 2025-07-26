import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, request }) => {
  const { node, vmid, type } = await request.json();

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
    const del = await fetch(
      `https://${locals.PVEDomain}/api2/json/nodes/${node}/${type}/${vmid}?force=1&purge=1`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
          CSRFPreventionToken: locals.PVECSRFPreventionToken,
        },
      }
    );

    if (!del.ok) {
      return json(
        {
          error: 'Failed to delete the machine. ' + del.statusText,
        },
        { status: del.status }
      );
    }
  } catch (error) {
    return json(
      {
        error: `Failed to delet the machine:  ` + error,
      },
      { status: 500 }
    );
  }

  return json({ message: 'Successfully deleted the machine.' }, { status: 201 });
};
