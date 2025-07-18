import { setAuthCookies, clearAuthCookies } from '../lib/cookies';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    domainName: locals.domain,
    userName: locals.user,
    apiToken: locals.token,
  };
};

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const { domainName, userName, password, apiToken } = formData as Record<string, string>;

    try {
      const ticket = await fetch(`https://${domainName}/api2/json/access/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });
      if (!ticket.ok) {
        return {
          error: 'Login failed. Please check your credentials.',
          domainName,
          userName,
          apiToken,
        };
      }

      const token = await fetch(`https://${domainName}/api2/json/access/users/${userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PVEAPIToken=${userName}!api=${apiToken}`,
        },
      });
      if (!token.ok) {
        return {
          error: 'Login failed. Invalid API token',
          domainName,
          userName,
        };
      }

      const response = await ticket.json();

      setAuthCookies(cookies, {
        domain: domainName,
        user: userName,
        token: apiToken,
        ticket: response.data.ticket,
        csrf: response.data.CSRFPreventionToken,
      });

      return {
        success: true,
        error: '',
        domain: domainName,
        user: userName,
        apiToken: apiToken,
      };
    } catch (error) {
      return {
        error: 'Something went wrong. Please check the domain. ' + error,
        domainName,
        userName,
        apiToken,
      };
    }
  },

  logout: async ({ cookies }) => {
    clearAuthCookies(cookies);
  },
} satisfies Actions;
