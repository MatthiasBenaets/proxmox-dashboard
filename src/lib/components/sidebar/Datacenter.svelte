<script lang="ts">
  import { goto } from '$app/navigation';
  import { Building, Server, ChevronRight, Monitor, Container, File } from '@lucide/svelte';
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

<div
  class="m-2 mr-1 flex max-h-[calc(100dvh-3rem)] flex-col border border-neutral-600 bg-neutral-800"
>
  <div class="flex-1 overflow-y-auto">
    <div class="hover:bg-neutral-700">
      <div class="flex flex-row">
        <button class="cursor-pointer" onclick={() => (toggleDatacenter = !toggleDatacenter)}>
          <ChevronRight
            size={15}
            class="transition-transform duration-200 {toggleDatacenter ? 'rotate-90' : ''} mr-1"
          />
        </button>
        <button
          class="flex w-full cursor-pointer flex-row items-center"
          onclick={() => {
            goto(`/dashboard`);
          }}
        >
          <Building size={15} class="mr-1" />Datacenter
        </button>
      </div>
    </div>

    {#if toggleDatacenter && vms && vms.length != 0}
      {#each Object.entries(vms.reduce((acc: Record<string, VM[]>, vm: VM) => {
          if (!acc[vm.node]) acc[vm.node] = [];
          acc[vm.node].push(vm);
          return acc;
        }, {})) as [node, nodeVm] (node)}
        <div class="hover:bg-neutral-700">
          <div class="ml-4 flex flex-row">
            <button class="cursor-pointer" onclick={() => toggleNode(node)}>
              <ChevronRight
                size={15}
                class="transition-transform duration-200 {isNodeExpanded(node)
                  ? 'rotate-90'
                  : ''} mr-1"
              />
            </button>
            <button
              class="flex w-full cursor-pointer flex-row items-center"
              onclick={() => {
                goto(`/dashboard?node=${node}`);
              }}
            >
              <Server size={15} class="mr-1" />{node}
            </button>
          </div>
        </div>

        {#if isNodeExpanded(node)}
          {#each nodeVm as vm (vm.vmid)}
            <div class="hover:bg-neutral-700">
              <button
                class="cursor pointer flex w-full cursor-pointer flex-row items-center pl-12 text-left"
                onclick={() => {
                  updateSearchParam('vmid', vm.vmid.toString());
                  updateSearchParam('node', vm.node);
                  updateSearchParam('type', vm.type);
                }}
              >
                <div class="relative flex flex-row items-center">
                  {#if vm.template == 1}
                    <File size={15} class="mr-1" />
                  {:else if vm.type == 'lxc'}
                    <Container size={15} class="mr-1" />
                  {:else if vm.type == 'qemu'}
                    <Monitor size={15} class="mr-1" />
                  {/if}{vm.vmid} ({vm.name})
                  {#if vm.status == 'running'}
                    <div class="absolute top-1.5 left-1">
                      <svg
                        class="h-5 w-5 text-green-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  {:else if vm.template == 1}
                    <div class="absolute -bottom-0.5 left-1.5">
                      {#if vm.type == 'lxc'}
                        <Container size={11} class="fill-neutral-800" />
                      {:else if vm.type == 'qemu'}
                        <Monitor size={11} />
                      {/if}
                    </div>
                  {/if}
                </div>
              </button>
            </div>
          {/each}
        {/if}
      {/each}
    {/if}
  </div>
</div>
