<script lang="ts">
  import { currentErrors } from '$lib/error.svelte';
  import { epochToTime } from '$lib/utils';
  import type { Task } from '$lib/types';

  let { params } = $props();
  let tasks: Task[] = $state([]);
  let error = $state('');

  async function fetchLink() {
    if (params.vmid) {
      const response = await fetch(`/dashboard/${params.vmid}/tasks`, {
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
      ({ tasks, error } = await fetchLink());
      if (error) {
        currentErrors.set(error);
      }
    }
    loadData();
  });
</script>

{#if tasks}
  <div class="relative col-span-2 flex max-h-96 min-h-36 flex-col border border-neutral-600">
    <div class="flex h-6 w-full items-center border-b border-neutral-600 bg-neutral-700/50 px-2">
      Task log
    </div>
    <div
      class="grid w-full grid-cols-4 divide-x-2 divide-neutral-700/50 border-b border-neutral-700 bg-neutral-700/50"
    >
      <div class="px-2">Start Time</div>
      <div class="px-2">End Time</div>
      <div class="px-2">Description</div>
      <div class="px-2">Status</div>
    </div>
    <div class="overflow-y-auto">
      {#each tasks as task (task.pid)}
        <div
          class="grid w-full grid-cols-4 divide-x-2 divide-neutral-700/50 border-b border-neutral-700/50"
        >
          <div class="px-2">
            {epochToTime(task.starttime)}
          </div>
          <div class="px-2">
            {epochToTime(task.endtime)}
          </div>
          <div class="px-2">
            {#if task.type == 'vzstart' || task.type == 'qmstart'}
              Start
            {:else if task.type == 'vzstop' || task.type == 'qmstop'}
              Stop
            {:else if task.type == 'vzshutdown' || task.type == 'qmshutdown'}
              Shutdown
            {:else if task.type == 'vzreboot' || task.type == 'qmreboot'}
              Reboot
            {:else if task.type == 'vzreset' || task.type == 'qmreset'}
              Reset
            {:else if task.type == 'vzpause' || task.type == 'qmpause'}
              Pause
            {:else if task.type == 'vzresume' || task.type == 'qmresume'}
              Resume
            {:else if task.type == 'vzdestroy' || task.type == 'qmdestroy'}
              Delete
            {:else if task.type == 'vncproxy'}
              Remote connect
            {:else if task.type == 'vzclone' || task.type == 'qmclone'}
              Clone
            {:else}
              {task.type}
            {/if}
          </div>
          <div class="px-2">
            {task.status}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
