<script lang="ts">
  import Top from '$lib/components/body/parts/Top.svelte';
  import { showError } from '$lib/error.svelte';
  import { fetchVmData } from '$lib/utils';
  import type { VM } from '$lib/types';

  let { params } = $props();
  let vm: VM | null = $state(null);
  let link = $state('');
  let error = $state('');
  let ready = $state(false);

  async function fetchLink() {
    if (params.vmid) {
      const response = await fetch(`/dashboard/${params.vmid}/remote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        return {
          error: (await response.json()).error,
        };
      }
      const result = await response.json();
      return result;
    } else {
      return {
        link: '',
      };
    }
  }

  $effect(() => {
    async function loadData() {
      ({ vm, error } = await fetchVmData(params));
      if (error) {
        showError(error);
      }
      ({ link, error } = await fetchLink());
      if (error) {
        showError(error);
      }
      ready = true;
    }
    loadData();
  });
</script>

{#if ready && link && vm}
  <Top>
    <div class="flex flex-row justify-between">
      <p>
        {#if params.type == 'lxc'}
          Container
        {:else}
          Virtual Machine
        {/if}
        {vm.vmid} ({vm.name}) on node '{params.node}'
      </p>
      <div class="grid grid-cols-2 gap-4">
        <a
          class="flex justify-center border border-neutral-500 bg-neutral-600 px-5 hover:bg-neutral-500"
          href="/dashboard?vmid={params.vmid}&node={params.node}&type={params.type}"
        >
          Overview
        </a>
        <div class="flex justify-center border border-amber-600 bg-neutral-600 px-5">Connect</div>
      </div>
    </div>
  </Top>

  <iframe
    src={link}
    title="Remote Virtual Machine"
    class="h-full w-full border-none"
    allowfullscreen
  ></iframe>
{:else}
  <Top>
    Connecting to {#if params.type == 'lxc'}
      Container
    {:else if params.type == 'qemu'}
      Virtual Machine
    {/if}
    {params.vmid}...
  </Top>
{/if}
