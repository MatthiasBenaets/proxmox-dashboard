export function validateAuth(
  locals: App.Locals
): { valid: true } | { valid: false; message: string } {
  if (
    !locals.PVEAuthCookie ||
    !locals.PVEUser ||
    !locals.PVEDomain ||
    !locals.PVECSRFPreventionToken
  ) {
    return { valid: false, message: 'Unable to authenticate. Please log out and in again.' };
  }
  return { valid: true };
}
