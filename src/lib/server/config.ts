import { env } from '$env/dynamic/private';

const config = {
  NODES: env.NODES || 'pve',
};

export default config;
