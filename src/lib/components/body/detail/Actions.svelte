<script lang="ts">
  import { Play, Power, RefreshCw } from '@lucide/svelte';

  let { vm, params } = $props();
</script>

<div class="flex flex-col border border-neutral-600">
  <div class="flex h-6 w-full items-center border-b border-neutral-600 bg-neutral-700/50 px-2">
    Actions
  </div>
  <div class="grid grid-cols-1 gap-2 px-8 py-4">
    <button
      class="flex flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm
      {vm.status == 'running' ? 'text-neutral-600' : 'cursor-pointer hover:bg-neutral-700'}"
      onclick={() => {
        if (vm.status == 'stopped') {
          fetch(`/dashboard/${params.vmid}/status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'start',
              node: params.node,
              vmid: params.vmid,
              type: vm.type,
            }),
          });
        }
      }}
    >
      <Play size={15} class="mr-1" /> Start
    </button>
    <button
      class="flex flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm
      {vm.status == 'stopped' ? 'text-neutral-600' : 'cursor-pointer hover:bg-neutral-700'}"
      onclick={() => {
        if (vm.status == 'running') {
          fetch(`/dashboard/${params.vmid}/status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'stop',
              node: params.node,
              vmid: params.vmid,
              type: vm.type,
            }),
          });
        }
      }}
    >
      <Power size={15} class="mr-1" /> Shutdown
    </button>
    <button
      class="flex flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm
      {vm.status == 'stopped' ? 'text-neutral-600' : 'cursor-pointer hover:bg-neutral-700'}"
      onclick={() => {
        if (vm.status == 'running') {
          fetch(`/dashboard/${params.vmid}/status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'reboot',
              node: params.node,
              vmid: params.vmid,
              type: vm.type,
            }),
          });
        }
      }}
    >
      <RefreshCw size={15} class="mr-1" /> Reboot
    </button>
  </div>
</div>
