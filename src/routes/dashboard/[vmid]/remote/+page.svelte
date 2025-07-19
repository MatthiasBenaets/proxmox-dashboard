<script lang="ts">
  let { data } = $props();
  let { param, link, error } = data;
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden">
  {#if param}
    <div class="w-screen">
      <h1>{param.vmid}</h1>
    </div>
  {/if}

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
