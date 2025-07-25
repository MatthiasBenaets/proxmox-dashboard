import config from '$lib/server/config';
import { setCookie, clearCookies } from '$lib/cookies';
import { getBaseDomain } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    domainName: config.DOMAIN,
    userName: config.USERNAME,
    realm: config.REALM,
    apiToken: config.TOKEN,
    nodes: config.NODES,
  };
};

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const domainName = config.DOMAIN || (formData.domainName as string);
    const userName = config.USERNAME || (formData.userName as string);
    const password = formData.password as string;
    const realm = config.REALM || (formData.realm as string);
    const apiToken = config.TOKEN || (formData.apiToken as string);
    const nodes = config.NODES || (formData.nodes as string);

    try {
      const ticket = await fetch(`https://${domainName}/api2/json/access/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName + '@' + realm,
          password: password,
        }),
      });
      if (!ticket.ok) {
        return {
          error: 'Login failed. Please check your credentials.',
          domainName,
          userName,
          realm,
          apiToken,
          nodes,
        };
      }
      const token = await fetch(
        `https://${domainName}/api2/json/access/users/${userName}@${realm}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `PVEAPIToken=${userName}@${realm}!api=${apiToken}`,
          },
        }
      );
      if (!token.ok) {
        return {
          error: 'Login failed. Invalid API token',
          domainName,
          userName,
        };
      }

      const response = await ticket.json();
      setCookie(cookies, 'PVEDomain', domainName);
      setCookie(cookies, 'PVEUser', userName);
      setCookie(cookies, 'PVERealm', realm);
      setCookie(cookies, 'PVEAPIToken', apiToken);
      setCookie(cookies, 'PVECSRFPreventionToken', response.data.CSRFPreventionToken, {
        domain: getBaseDomain(domainName),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 2,
      });
      setCookie(cookies, 'PVEAuthCookie', response.data.ticket, {
        domain: getBaseDomain(domainName),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 2,
      });
      setCookie(cookies, 'PVENodes', nodes);

      return {
        success: true,
      };
    } catch (error) {
      return {
        error: 'Something went wrong. Please check the domain. ' + error,
        domainName,
        userName,
        realm,
        apiToken,
        nodes,
      };
    }
  },

  logout: async ({ cookies }) => {
    clearCookies(cookies);
  },
} satisfies Actions;
