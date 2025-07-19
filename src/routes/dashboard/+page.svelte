<script lang="ts">
  let { data } = $props();
  const { locals, vms, error } = data;

  if (vms) vms.sort((a, b) => a.vmid - b.vmid);
</script>

Logged in as {locals?.user}

<p>{error}</p>

{#if vms && vms.length != 0}
  {#each vms as vm, index (vm.vmid)}
    <div class="flex flex-row">
      <p class="w-1/2">
        {index + 1}:
        {vm.node} - {vm.type || 'qemu'} - {vm.vmid} - {vm.name} - {vm.status}
        {vm.template == 1 ? '- template' : ''}
      </p>
      <!-- <a href="/dashboard/{vm.node}/{vm.type}/{vm.vmid}"> Open </a> -->
      <a href="/dashboard/{vm.vmid}?node={vm.node}&type={vm.type}" class="w-1/2"> Open </a>
    </div>
  {/each}
{/if}
