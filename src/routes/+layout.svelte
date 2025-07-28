<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/header/Header.svelte';
  import Error from '$lib/components/toast/Error.svelte';
  import Alert from '$lib/components/toast/Alert.svelte';
  import { currentErrors } from '$lib/error.svelte';
  import { currentAlerts } from '$lib/alert.svelte';

  let { children } = $props();
</script>

<div
  class="flex h-screen min-w-5xl flex-col bg-neutral-900 text-sm text-neutral-200"
  data-sveltekit-prefetch
>
  <Header />
  <main class="flex flex-grow items-center justify-center">
    {@render children()}
  </main>

  {#if currentAlerts.get().length > 0}
    <Alert />
  {/if}

  {#if currentErrors.get().length > 0}
    <Error />
  {/if}
</div>
