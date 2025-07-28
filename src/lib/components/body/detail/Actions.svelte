<script lang="ts">
  import { goto } from '$app/navigation';
  import { Play, Power, RefreshCw, Copy, Trash } from '@lucide/svelte';
  import { currentAlerts } from '$lib/alert.svelte';
  import { currentErrors } from '$lib/error.svelte';

  let { vm, params } = $props();
  let confirmDelete = $state(false);
  let confirmClone = $state(false);
  let hostname = $state('');

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
      currentAlerts.set(message);
    } else {
      currentErrors.set('Something went wrong: ' + (await res.json()).error);
    }
  }

  async function cloneVm(name: string) {
    if (!name) {
      currentAlerts.set('Please enter a name for the cloned machine.');
      return;
    }

    const res = await fetch(`/dashboard/${params.vmid}/clone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node: params.node,
        vmid: params.vmid,
        type: vm.type,
        name: name,
      }),
    });

    const data = await res.json();

    if (res.status == 201) {
      currentAlerts.set(
        `Succesfully cloned to ${data.vmid} (${name}). You will be redirected in 3 seconds.`
      );

      setTimeout(() => {
        goto(`/dashboard?vmid=${data.vmid}&node=${vm.node}&type=${vm.type}`);
      }, 3000);
    } else {
      currentErrors.set('Something went wrong: ' + data.error);
    }
  }

  async function deleteVm() {
    const res = await fetch(`/dashboard/${params.vmid}/delete`, {
      method: 'DELETE',
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
      currentAlerts.set(`Succesfully deleted ${params.vmid}. You will be redirected in 3 seconds.`);

      setTimeout(() => {
        goto(`/dashboard`);
      }, 3000);
    } else {
      currentErrors.set('Something went wrong: ' + data.error);
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
      {#if !confirmClone}
        <button
          class="flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm hover:bg-neutral-700"
          onclick={() => {
            confirmClone = true;
          }}
        >
          <Copy size={15} class="mr-1" /> Clone
        </button>
      {:else}
        <div
          class="border-neurtral-600 my-auto flex flex-row justify-between rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm"
        >
          <input
            type="text"
            placeholder="Clone name"
            bind:value={hostname}
            class="w-full rounded border border-neutral-600 text-xs"
          />
          <div class="flex flex-row">
            <button
              class="mx-2 flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 text-xs hover:bg-neutral-700"
              onclick={() => {
                cloneVm(hostname);
              }}
            >
              Confirm
            </button>
            <button
              class="flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 text-xs hover:bg-neutral-700"
              onclick={() => {
                confirmClone = false;
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      {/if}
    {/if}
    {#if vm.template != 1}
      {#if !confirmDelete}
        <button
          class="flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm hover:bg-neutral-700"
          onclick={() => {
            confirmDelete = true;
          }}
        >
          <Trash size={15} class="mr-1" /> Delete
        </button>
      {:else}
        <div
          class="border-neurtral-600 flex flex-row items-center justify-between rounded border border-neutral-600 bg-neutral-700/50 px-2 py-1 text-sm"
        >
          <div class="flex flex-row items-center">
            <Trash size={15} class="mr-1" /> Delete
          </div>
          <div class="flex flex-row items-center">
            <button
              class="mr-2 flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 text-xs hover:bg-neutral-700"
              onclick={() => {
                deleteVm();
              }}
            >
              Confirm
            </button>
            <button
              class="flex cursor-pointer flex-row items-center rounded border border-neutral-600 bg-neutral-700/50 px-2 text-xs hover:bg-neutral-700"
              onclick={() => {
                confirmDelete = false;
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
