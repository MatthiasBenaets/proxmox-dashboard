<script lang="ts">
  import { Container, Monitor, File } from '@lucide/svelte';
  import { updateSearchParam } from '$lib/utils';

  let { vms, node } = $props();
</script>

<div class="flex flex-col">
  <div class="flex h-10 w-full flex-row items-center border-b-1 border-neutral-600">
    <div class="w-1/5 pl-2">Type</div>
    <div class="w-1/5">Description</div>
    <div class="w-1/5">Disk usage</div>
    <div class="w-1/5">Memory usage</div>
    <div class="w-1/5">Uptime</div>
  </div>

  {#if vms && vms.length != 0}
    {#each vms as vm, index (vm.vmid)}
      {#if node == null || node == vm.node}
        <button
          class="flex h-10 w-full flex-row {index % 2 == 0
            ? 'bg-neutral-900'
            : ''} items-center text-left hover:bg-neutral-700/50"
          onclick={() => {
            updateSearchParam('vmid', vm.vmid);
            updateSearchParam('node', vm.node);
            updateSearchParam('type', vm.type);
          }}
        >
          <div class="flex w-1/5 flex-row pl-2">
            <div class="relative">
              {#if vm.template == 1}
                <File size={20} />
              {:else if vm.type == 'lxc'}
                <Container size={20} />
              {:else if vm.type == 'qemu'}
                <Monitor size={20} />
              {/if}
              {#if vm.status == 'running'}
                <div class="absolute -bottom-2 left-1.5">
                  <svg
                    class="h-6 w-6 text-green-500"
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
                <div class="absolute -bottom-1 left-2.5">
                  {#if vm.type == 'lxc'}
                    <Container size={13} class="fill-neutral-800" />
                  {:else if vm.type == 'qemu'}
                    <Monitor size={13} />
                  {/if}
                </div>
              {/if}
            </div>
            <div class="pl-2">
              {vm.type || 'qemu'}
            </div>
          </div>
          <div class="w-1/5">
            {vm.vmid} ({vm.name})
          </div>
          <div class="w-1/5">
            {#if vm.disk}
              {(vm.disk / 1_000_000_000).toFixed(1)} / {(vm.maxdisk / 1_000_000_000).toFixed(1)}
              GB ({((vm.disk / vm.maxdisk) * 100).toFixed(1)} %)
            {:else}
              -
            {/if}
          </div>
          <div class="w-1/5">
            {((vm.mem / vm.maxmem) * 100).toFixed(1)} %
          </div>
          <div class="w-1/5">
            {(vm.uptime / 60 / 60 / 24).toFixed(0)} days
          </div>
        </button>
      {/if}
    {/each}
  {/if}
</div>
