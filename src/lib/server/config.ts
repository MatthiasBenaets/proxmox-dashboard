import { env } from '$env/dynamic/private';

const config = {
  DOMAIN: env.DOMAIN,
  USERNAME: env.USERNAME,
  PASSWORD: env.PASSWORD,
  REALM: env.REALM,
  TOKEN: env.TOKEN,
  NODES: env.NODES,
};

export default config;
