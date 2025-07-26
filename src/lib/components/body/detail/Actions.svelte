<script lang="ts">
  import { goto } from '$app/navigation';
  import { Play, Power, RefreshCw, Copy } from '@lucide/svelte';
  import { showAlert } from '$lib/alert.svelte';
  import { showError } from '$lib/error.svelte';

  let { vm, params } = $props();

  async function executeAction(action: 'start' | 'reboot' | 'shutdown' | 'clone', message: string) {
    const res = await fetch(`/dashboard/${params.vmid}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        node: params.node,
        vmid: params.vmid,
        type: vm.type,
      }),
    });

    if (res.status == 201) {
      showAlert(message);
    } else {
      showError('Something went wrong: ' + (await res.json()).error);
    }
  }

  async function cloneVm() {
    const res = await fetch(`/dashboard/${params.vmid}/clone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node: params.node,
        vmid: params.vmid,
        type: vm.type,
      }),
    });

    const data = await res.json();

    if (res.status == 201) {
      showAlert(`Succesfully cloned to ${data.vmid}. You will be redirected in 3 seconds.`);

      setTimeout(() => {
        goto(`/dashboard?vmid=${data.vmid}&node=${vm.node}&type=${vm.type}`);
      }, 3000);
    } else {
      showError('Something went wrong: ' + data.error);
    }
  }
</script>

<div class="flex flex-col border border-neutral-600">
  <div class="flex h-6 w-full items-center border-b border-neutral-600 bg-neutral-700/50 px-2">
    Actions
  </div>
  <div class="grid grid-cols-1 gap-2 px-8 py-4">
    <button
      class="flex flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm
      {vm.status == 'running' || vm.template == 1
        ? 'text-neutral-600'
        : 'cursor-pointer hover:bg-neutral-700'}"
      onclick={() => {
        if (vm.status == 'stopped' && vm.template == 1) {
          executeAction('start', `Succesfully started ${vm.vmid} (${vm.name})`);
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
          executeAction('shutdown', `Shutdown requested for ${vm.vmid} (${vm.name})`);
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
          executeAction('reboot', `Reboot requested for ${vm.vmid} (${vm.name})`);
        }
      }}
    >
      <RefreshCw size={15} class="mr-1" /> Reboot
    </button>
    {#if vm.template == 1}
      <button
        class="flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm hover:bg-neutral-700"
        onclick={() => {
          cloneVm();
        }}
      >
        <Copy size={15} class="mr-1" /> Clone
      </button>
    {/if}
  </div>
</div>
