<script lang="ts">
  import { page } from '$app/state';
</script>

<nav class="top-0 flex h-8 w-full flex-row items-center px-2">
  <h1 class="text-bold text-xl text-amber-600">Proxmox Dashboard</h1>

  {#if page.url.pathname !== '/' && page.url.pathname !== '/login'}
    <form action="/logout" method="POST" class="ml-auto">
      <button type="submit" class="cursor-pointer">Logout</button>
    </form>
  {/if}
</nav>
