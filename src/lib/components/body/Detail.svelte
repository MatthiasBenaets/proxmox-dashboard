<script lang="ts">
  import type { VM } from '$lib/types';
  import { showError } from '$lib/error.svelte';

  let { params } = $props();
  let vm: VM | null = $state(null);
  let error = $state('');
  let ready = $state(false);

  async function fetchData() {
    if (params.vmid) {
      const response = await fetch(`/dashboard/${params.vmid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    } else {
      return {
        vm: null,
      };
    }
  }

  $effect(() => {
    async function loadData() {
      ({ vm, error } = await fetchData());
      if (error) {
        showError(error);
      }
      ready = true;
    }
    loadData();
  });
</script>

{#if ready}
  {#if !error}
    {#if vm}
      {JSON.stringify(vm)}
      <a href="/dashboard?vmid={params.vmid}&node={params.node}&type={params.type}&remote=1">
        Connect
      </a>
    {/if}
  {:else}
    <p>{error}</p>
    <p>Return to <a href="/dashboard">dashboard</a></p>
  {/if}
{/if}
