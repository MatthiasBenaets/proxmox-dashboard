<script lang="ts">
  let { children } = $props();
</script>

<div class="flex h-7 w-full items-center border-b border-neutral-600 bg-neutral-800">
  <div class="w-full px-2">
    {@render children()}
  </div>
</div>
