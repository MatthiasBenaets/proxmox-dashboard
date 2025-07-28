// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      PVEDomain: string | undefined;
      PVENodes: string | undefined;
      PVEUser: string | undefined;
      PVERealm: string | undefined;
      PVEAPIToken: string | undefined;
      PVEAuthCookie: string;
      PVECSRFPreventionToken: string;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
