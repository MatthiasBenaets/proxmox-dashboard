import { page } from '$app/state';
import { goto } from '$app/navigation';

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

export function timeFormat(time: number) {
  const days = Math.floor(time / (24 * 3600));
  let remainingSeconds = time % (24 * 3600);

  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds %= 3600;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${days} days ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function epochToTime(epoch: number) {
  const date = new Date(epoch * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
