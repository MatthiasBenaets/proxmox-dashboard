enum Status {
  Stopped = 'stopped',
  Running = 'running',
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
  pid: number;
  qmpstatus?: string;
  'running-machine'?: string;
  'running-qemu'?: string;
  serial?: string;
  status: Status;
  tags: string;
  template: number;
  type?: string;
  uptime: number;
  vmid: number;
}
