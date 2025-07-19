<script lang="ts">
  let { data } = $props();
  const { locals, vms, error } = data;

  if (vms) vms.sort((a, b) => a.vmid - b.vmid);
</script>

Logged in as {locals?.user}

<p>{error}</p>

{#if vms && vms.length != 0}
  {#each vms as vm, index (vm.vmid)}
    <p>
      {index + 1}:
      {vm.node} - {vm.type || 'qemu'} - {vm.vmid} - {vm.name} - {vm.status}
      {vm.template == 1 ? '- template' : ''}
    </p>
  {/each}
{/if}
