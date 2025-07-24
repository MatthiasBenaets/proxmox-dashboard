import { page } from '$app/state';
import { goto } from '$app/navigation';
import type { Params } from '$lib/types';

export function updateSearchParam(key: string, value?: string) {
  const url = page.url;
  if (value == '' || !value) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  goto(url, { replaceState: true });
}

export function getBaseDomain(host: string) {
  const parts = host.split('.');
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

export async function fetchVmData(params: Params) {
  if (!params.vmid && !params.node && !params.type) {
    return {
      error: '',
    };
  }

  const response = await fetch(`/dashboard/${params.vmid}`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    return {
      error: (await response.json()).error,
    };
  }
  const result = await response.json();
  return result;
}
