<script lang="ts">
  import { showError } from '$lib/error.svelte';

  let { params } = $props();
  let link = $state('');
  let error = $state('');
  let ready = $state(false);

  async function fetchData() {
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
      ({ link, error } = await fetchData());
      if (error) {
        showError(error);
      }
      ready = true;
    }
    loadData();
  });
</script>

{#if ready}
  {#if !error}
    <iframe
      src={link}
      title="Remote Virtual Machine"
      class="h-full w-full border-none"
      allowfullscreen
    ></iframe>
  {:else}
    <p>{error}</p>
  {/if}
{/if}
