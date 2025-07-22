enum Status {
  Stopped = 'stopped',
  Running = 'running',
}

enum Type {
  Qemu = 'qemu',
  Lxc = 'lxc',
}

export interface VM {
  cpu: number;
  cpus: number;
  disk?: number;
  diskread: number;
  diskwrite: number;
  lock: string;
  maxdisk: number;
  maxmem: number;
  maxswap?: number;
  mem: number;
  name: string;
  netin: number;
  netout: number;
  node: string;
  pid: number;
  qmpstatus?: string;
  'running-machine'?: string;
  'running-qemu'?: string;
  serial?: string;
  status: Status;
  tags: string;
  template: number;
  type: Type;
  uptime: number;
  vmid: number;
}

export interface Params {
  vmid: string | number | null;
  node: string | null;
  type: string | null;
}
