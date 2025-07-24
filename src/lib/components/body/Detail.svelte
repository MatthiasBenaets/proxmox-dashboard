<script lang="ts">
  import Top from '$lib/components/body/parts/Top.svelte';
  import { showError } from '$lib/error.svelte';
  import { fetchVmData } from '$lib/utils';
  import type { VM } from '$lib/types';

  let { params } = $props();
  let vm: VM | null = $state(null);
  let error = $state('');
  let ready = $state(false);

  $effect(() => {
    if (params.vmid && params.node && params.type) {
      async function loadData() {
        ({ vm, error } = await fetchVmData(params));
        if (error) {
          showError(error);
        }
        ready = true;
      }
      loadData();
    }
  });
</script>

{#if ready && vm}
  <Top>
    <div class="flex flex-row justify-between">
      <p>
        {#if vm.type == 'lxc'}
          Container
        {:else}
          Virtual Machine
        {/if}
        {vm.vmid} ({vm.name}) on node '{params.node}'
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex justify-center border border-amber-600 bg-neutral-600 px-5">Overview</div>
        <a
          class="flex justify-center border border-neutral-500 bg-neutral-600 px-5 hover:bg-neutral-500"
          href="/dashboard?vmid={params.vmid}&node={params.node}&type={params.type}&remote=1"
        >
          Connect
        </a>
      </div>
    </div>
  </Top>
{:else}
  <Top>
    Loading {#if params.type == 'lxc'}
      Container
    {:else if params.type == 'qemu'}
      Virtual Machine
    {/if}
    {params.vmid} data ...
  </Top>
{/if}
