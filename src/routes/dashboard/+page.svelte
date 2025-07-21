<script lang="ts">
  import { page } from '$app/state';
  import Overview from '$lib/components/Overview.svelte';
  import Detail from '$lib/components/Detail.svelte';
  import Remote from '$lib/components/Remote.svelte';
  import { updateSearchParam } from '$lib/utils';

  let { data } = $props();
  const { vms, error } = data;

  let params = $derived({
    vmid: null,
    node: null,
    type: null,
  });

  if (vms) vms.sort((a, b) => a.vmid - b.vmid);

  $effect(() => {
    params = {
      vmid: page.url.searchParams.get('vmid'),
      node: page.url.searchParams.get('node'),
      type: page.url.searchParams.get('type'),
    };
  });
</script>

<div class="h-full w-full">
  <div class="grid h-full grid-cols-4 xl:grid-cols-5">
    <div class="m-2 mr-1 overflow-scroll border border-neutral-600 bg-neutral-800 p-2 px-3.5">
      <div class="flex flex-col">
        <details open>
          <summary>Datacenter</summary>
          {#if vms && vms.length != 0}
            {#each Object.entries(vms.reduce((acc: Record<string, typeof vms>, vm) => {
                if (!acc[vm.node]) acc[vm.node] = [];
                acc[vm.node].push(vm);
                return acc;
              }, {})) as [node, nodeVms] (node)}
              <details open class="pl-4">
                <summary>{node}</summary>
                {#each nodeVms as vm (vm.vmid)}
                  <div class="pl-4">
                    <button
                      class="cursor-pointer text-left"
                      onclick={() => {
                        updateSearchParam('vmid', vm.vmid);
                        updateSearchParam('node', vm.node);
                        updateSearchParam('type', vm.type);
                      }}
                    >
                      {vm.vmid} ({vm.name})
                    </button>
                  </div>
                {/each}
              </details>
            {/each}
          {/if}
        </details>
      </div>
    </div>
    <div
      class="col-span-3 m-2 ml-1 overflow-scroll border border-neutral-600 bg-neutral-800 xl:col-span-4"
    >
      {#if !page.url.search}
        <Overview {vms} />
      {:else if page.url.searchParams.get('vmid') && page.url.searchParams.get('node') && page.url.searchParams.get('type')}
        {#if page.url.searchParams.get('remote') == '1'}
          <Remote {params} />
        {:else}
          <Detail {params} />
        {/if}
      {/if}
    </div>
  </div>
  <!-- <p>{error}</p> -->
</div>
