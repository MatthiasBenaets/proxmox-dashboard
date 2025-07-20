<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';

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
</div>
