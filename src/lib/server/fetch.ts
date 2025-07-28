export async function pveFetch(
  url: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  locals: App.Locals,
  body: BodyInit | undefined | null | Record<string, unknown> = {}
): Promise<Response> {
  return fetch(`https://${locals.PVEDomain}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `PVEAuthCookie=${locals.PVEAuthCookie}`,
      CSRFPreventionToken: locals.PVECSRFPreventionToken,
    },
    body: ['POST', 'PUT'].includes(method) ? JSON.stringify(body) : undefined,
  });
}
