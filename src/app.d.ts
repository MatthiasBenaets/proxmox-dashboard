// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      PVEDomain: string | undefined;
      PVEUser: string | undefined;
      PVEAPIToken: string | undefined;
      PVEAuthCookie: string | undefined;
      PVECSRFPreventionToken: string | undefined;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
