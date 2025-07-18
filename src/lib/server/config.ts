import { env } from '$env/dynamic/private';

const config = {
  SECRET_KEY: env.SECRET_KEY || 'proxmox',
  NODES: env.NODES || 'pve',
};

export default config;
