<script lang="ts">
  import { updateSearchParam } from '$lib/utils';
  import type { VM } from '$lib/types';

  let { vms }: { vms: VM[] | undefined } = $props();
</script>

<div class="flex flex-col">
  <details open>
    <summary>Datacenter</summary>
    {#if vms && vms.length != 0}
      {#each Object.entries(vms.reduce((acc: Record<string, VM[]>, vm: VM) => {
          if (!acc[vm.node]) acc[vm.node] = [];
          acc[vm.node].push(vm);
          return acc;
        }, {})) as [node, nodeVm] (node)}
        <details open class="pl-4">
          <summary>{node}</summary>
          {#each nodeVm as vm (vm.vmid)}
            {#if vm.vmid && vm.node && vm.type}
              <div class="pl-4">
                <button
                  class="cursor-pointer text-left"
                  onclick={() => {
                    updateSearchParam('vmid', vm.vmid.toString());
                    updateSearchParam('node', vm.node);
                    updateSearchParam('type', vm.type);
                  }}
                >
                  {vm.vmid} ({vm.name})
                </button>
              </div>
            {/if}
          {/each}
        </details>
      {/each}
    {/if}
  </details>
</div>
