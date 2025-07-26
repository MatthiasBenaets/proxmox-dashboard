<script lang="ts">
  import { page } from '$app/state';

  const loggedIn = page.url.pathname !== '/' && page.url.pathname !== '/login';
</script>

<nav class="top-0 flex h-[3rem] w-full flex-row items-center px-2">
  <h1 class="text-bold text-xl text-amber-600">
    <a href={loggedIn ? '/dashboard' : '/login'}>Proxmox Dashboard</a>
  </h1>

  {#if loggedIn}
    <form action="/logout" method="POST" class="ml-auto">
      <button type="submit" class="cursor-pointer">Logout</button>
    </form>
  {/if}
</nav>
