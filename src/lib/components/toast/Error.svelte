<script lang="ts">
  import { X } from '@lucide/svelte';
  import { currentErrors } from '$lib/error.svelte';
</script>

{#if currentErrors.get().length > 0}
  <div
    class="fixed right-4 bottom-5 flex flex-col space-y-2 border border-neutral-600 bg-red-500 p-2"
  >
    {#each currentErrors.get() as error, index (index)}
      <div
        class="{index == currentErrors.get().length - 1 ? '' : 'mb-2'} flex flex-row items-center"
      >
        <button class="mr-3 cursor-pointer px-1" on:click={() => currentErrors.clear(index)}>
          <X size={15} strokeWidth={4} />
        </button>
        <p class="pr-1 font-bold">Error:</p>
        <p>{error}</p>
      </div>
    {/each}
    {#if currentErrors.get().length > 1}
      <button
        class="absolute top-2 right-2 cursor-pointer border border-neutral-600 bg-red-500 px-2"
        on:click={() => currentErrors.clearAll()}
      >
        Clear All
      </button>
    {/if}
  </div>
{/if}
