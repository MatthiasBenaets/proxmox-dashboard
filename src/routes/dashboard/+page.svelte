<script lang="ts">
  import { page } from '$app/state';
  import Overview from '$lib/components/body/Overview.svelte';
  import Detail from '$lib/components/body/Detail.svelte';
  import Remote from '$lib/components/body/Remote.svelte';
  import Datacenter from '$lib/components/sidebar/Datacenter.svelte';
  import { showError } from '$lib/error.svelte';
  import type { VM, Params } from '$lib/types';

  let vms: VM[] = $state([]);
  let ready = $state(false);
  let error = $state('');

  let params: Params = $derived({
    vmid: null,
    node: null,
    type: null,
  });

  async function fetchVMData() {
    try {
      const response = await fetch('/dashboard');
      const data = await response.json();
      return {
        vms: data.vms,
        error: data.error,
      };
    } catch {
      return {
        error: 'Failed to fetch VMs.',
      };
    }
  }

  $effect(() => {
    params = {
      vmid: page.url.searchParams.get('vmid'),
      node: page.url.searchParams.get('node'),
      type: page.url.searchParams.get('type'),
    };
  });

  $effect(() => {
    async function loadData() {
      ({ vms, error } = await fetchVMData());
      if (error) {
        showError(error);
      }
      if (vms) vms.sort((a, b) => a.vmid - b.vmid);
      ready = true;
    }
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  });
</script>

{#if ready}
  <div class="h-full w-full">
    <div class="grid h-full grid-cols-4 xl:grid-cols-5">
      <Datacenter {vms} />
      <div
        class="col-span-3 m-2 ml-1 max-h-[calc(100dvh-3rem)] border border-neutral-600 bg-neutral-800 xl:col-span-4"
      >
        {#if !page.url.search || (page.url.searchParams.size == 1 && page.url.searchParams.get('node'))}
          <Overview {vms} node={params.node || null} />
        {:else if page.url.searchParams.get('vmid') && page.url.searchParams.get('node') && page.url.searchParams.get('type')}
          {#if page.url.searchParams.get('remote') == '1'}
            <Remote {params} vm={vms.find((vm) => vm.vmid == Number(params.vmid))} />
          {:else}
            <Detail {params} vm={vms.find((vm) => vm.vmid == Number(params.vmid))} />
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}
