<script lang="ts">
  let { data } = $props();
  let { vm, param, error } = data;
</script>

{#if !error}
  {#if param && vm}
    {JSON.stringify(vm)}
    <a href="/dashboard/{vm.vmid}/remote?node={param.node}&type={param.type}"> Connect </a>
  {/if}
{:else}
  <p>{error}</p>
  <p>Return to <a href="/dashboard">dashboard</a></p>
{/if}
