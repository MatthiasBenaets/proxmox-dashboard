import { page } from '$app/state';
import { goto } from '$app/navigation';

export function updateSearchParam(key: string, value: string) {
  const url = page.url;
  url.searchParams.set(key, value);
  goto(url, { replaceState: true });
}

export function getBaseDomain(host: string) {
  const parts = host.split('.');
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}
