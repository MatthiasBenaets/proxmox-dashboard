<script lang="ts">
  import { goto } from '$app/navigation';
  import { Building, Server, ChevronRight, Monitor, Container } from '@lucide/svelte';
  import { updateSearchParam } from '$lib/utils';
  import type { VM } from '$lib/types';

  let { vms }: { vms: VM[] | undefined } = $props();

  let toggleDatacenter = $state(true);
  let nodeState: Record<string, boolean> = $state({});

  function toggleNode(node: string) {
    nodeState[node] = nodeState[node] === undefined ? false : !nodeState[node];
  }

  function isNodeExpanded(node: string): boolean {
    return nodeState[node] === undefined ? true : nodeState[node];
  }
</script>

<div class="flex flex-col">
  <div class="flex flex-row hover:bg-neutral-700">
    <button class="cursor-pointer" onclick={() => (toggleDatacenter = !toggleDatacenter)}>
      <ChevronRight
        size={15}
        class="transition-transform duration-200 {toggleDatacenter ? 'rotate-90' : ''}"
      />
    </button>
    <button
      class="flex cursor-pointer flex-row items-center"
      onclick={() => {
        goto(`/dashboard`);
      }}
    >
      <Building size={15} />Datacenter
    </button>
  </div>

  {#if toggleDatacenter && vms && vms.length != 0}
    {#each Object.entries(vms.reduce((acc: Record<string, VM[]>, vm: VM) => {
        if (!acc[vm.node]) acc[vm.node] = [];
        acc[vm.node].push(vm);
        return acc;
      }, {})) as [node, nodeVm] (node)}
      <div class="flex flex-row pl-4 hover:bg-neutral-700">
        <button class="cursor-pointer" onclick={() => toggleNode(node)}>
          <ChevronRight
            size={15}
            class="transition-transform duration-200 {isNodeExpanded(node) ? 'rotate-90' : ''}"
          />
        </button>
        <button
          class="flex cursor-pointer flex-row items-center"
          onclick={() => {
            goto(`/dashboard?node=${node}`);
          }}
        >
          <Server size={15} />{node}
        </button>
      </div>

      {#if isNodeExpanded(node)}
        {#each nodeVm as vm (vm.vmid)}
          <div class="pl-12 hover:bg-neutral-700">
            <button
              class="cursor pointer flex cursor-pointer flex-row items-center text-left"
              onclick={() => {
                updateSearchParam('vmid', vm.vmid.toString());
                updateSearchParam('node', vm.node);
                updateSearchParam('type', vm.type);
              }}
            >
              {#if vm.type == 'lxc'}<Container size={15} />{:else}<Monitor
                  size={15}
                />{/if}{vm.vmid} ({vm.name})
            </button>
          </div>
        {/each}
      {/if}
    {/each}
  {/if}
</div>
