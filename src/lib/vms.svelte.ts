import type { VM } from '$lib/types';

let vms: VM[] = $state([]);

export const currentVMs = {
  get() {
    return vms;
  },
  set(v: VM[]) {
    vms = v;
  },
};
