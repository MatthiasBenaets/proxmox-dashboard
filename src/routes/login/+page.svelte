<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let formInput = $state([
    {
      name: 'domainName',
      label: 'Domain Name',
      type: 'text',
      value: data.domainName,
    },
    {
      name: 'userName',
      label: 'User Name',
      type: 'text',
      value: data.userName,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      toggle: true,
      visible: false,
    },
    {
      name: 'apiToken',
      label: 'API Token',
      type: 'text',
      value: data.apiToken,
      toggle: true,
      visible: false,
    },
  ]);
  let pending = $state(false);
</script>

<h1 class="text-3xl font-bold text-orange-500">Dashboard</h1>

{#if data.domainName && data.userName && data.apiToken}
  <form action="?/logout" method="POST" use:enhance>
    <button type="submit">Logout</button>
  </form>
{:else}
  <form
    action="?/login"
    method="POST"
    use:enhance={() => {
      pending = true;
      if (form?.error) form = { ...form, error: '' };
      return async ({ update }) => {
        await update();
        pending = false;
      };
    }}
    class="m-2 flex flex-col"
  >
    {#each formInput as input (input.name)}
      <div class="flex w-full flex-row pb-2">
        <label for={input.name} class="w-2/8">{input.label}</label>
        <input
          type={input.toggle ? (input.visible ? 'text' : 'password') : input.type}
          name={input.name}
          required
          defaultValue={form?.[input.name as keyof typeof form] || input.value || ''}
          class="w-5/8 border border-black"
        />
        {#if input.toggle}
          <button
            type="button"
            onmousedown={() => (input.visible = !input.visible)}
            onmouseup={() => (input.visible = !input.visible)}
            onmouseleave={() => (input.visible = false)}
            class="ml-2 cursor-pointer rounded bg-orange-500 px-2 font-bold text-white hover:bg-orange-700"
          >
            Show
          </button>
        {/if}
      </div>
    {/each}
    <button
      type="submit"
      disabled={pending}
      class="cursor-pointer rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700"
    >
      {#if !pending}
        Login
      {:else}
        Logging in...
      {/if}
    </button>
    {#if form?.error}
      <p class="text-red-500">{form.error}</p>
    {/if}
  </form>
{/if}
