<script lang="ts">
  let { data } = $props();
  const locals = data.locals;
</script>

Logged in as {locals.user}
