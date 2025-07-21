<script lang="ts">
  import type { VM } from '$lib/types';

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

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } else {
      return {
        vm: null,
        error: 'No vmid provided',
      };
    }
  }

  $effect(() => {
    async function loadData() {
      ({ vm, error } = await fetchData());
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
