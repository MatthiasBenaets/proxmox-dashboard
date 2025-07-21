<script lang="ts">
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

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } else {
      return {
        link: '',
        error: 'No vmid provided',
      };
    }
  }

  $effect(() => {
    async function loadData() {
      ({ link, error } = await fetchData());
      ready = true;
      console.log(link);
    }
    loadData();
  });
</script>

{#if ready}
  <div class="flex h-screen w-screen flex-col overflow-hidden">
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
  </div>
{/if}
