<script lang="ts">
  import Top from '$lib/components/body/general/Top.svelte';
  import Status from '$lib/components/body/detail/Status.svelte';
  import Actions from '$lib/components/body/detail/Actions.svelte';
  import Tasks from '$lib/components/body/detail/Tasks.svelte';
  let { params, vm } = $props();
</script>

{#if vm}
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
        {#if vm.status == 'running'}
          <a
            class="flex justify-center border border-neutral-500 bg-neutral-600 px-5 hover:bg-neutral-500"
            href="/dashboard?vmid={params.vmid}&node={params.node}&type={params.type}&remote=1"
          >
            Connect
          </a>{:else if vm.status == 'stopped'}
          <div
            class="flex cursor-not-allowed justify-center border border-neutral-500 bg-neutral-600 px-5 text-neutral-500"
          >
            Connect
          </div>
        {/if}
      </div>
    </div>
  </Top>
  <div class="grid grid-cols-[55%_auto] gap-2 p-2">
    <Status {vm} {params} />
    <Actions {vm} {params} />
    <Tasks {params} />
  </div>
{/if}
