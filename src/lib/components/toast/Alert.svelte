<script lang="ts">
  import { alertState } from '$lib/alert.svelte';
</script>

{#if alertState.alerts.length > 0}
  <div
    class="fixed top-5 right-4 flex flex-col space-y-2 border border-neutral-600 bg-blue-500 p-2"
  >
    {#each alertState.alerts as alert, index (index)}
      <div class="{index == alertState.alerts.length - 1 ? '' : 'mb-2'} flex flex-row items-center">
        <p class="pr-1 font-bold">Alert:</p>
        <p>{alert}</p>
      </div>
    {/each}
  </div>
{/if}
