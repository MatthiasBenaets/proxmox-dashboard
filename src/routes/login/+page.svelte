<script lang="ts">
  import { enhance } from '$app/forms';
  import { Eye, EyeOff } from '@lucide/svelte';

  interface FormInput {
    name: string;
    label: string;
    type: string;
    toggle?: boolean;
    visible?: boolean;
    value?: string | boolean | undefined;
    load?: boolean;
  }

  let { data, form } = $props();
  let formInput: FormInput[] = $state([
    {
      name: 'domainName',
      label: 'domain',
      type: 'text',
      value: form?.domainName || data.domainName,
      load: data.domainName ? true : false,
    },
    {
      name: 'userName',
      label: 'user',
      type: 'text',
      value: form?.userName || data.userName,
      load: data.userName ? true : false,
    },
    {
      name: 'password',
      label: 'password',
      type: 'password',
      toggle: true,
      visible: false,
    },
    {
      name: 'realm',
      label: 'realm',
      type: 'text',
      value: form?.realm || data.realm,
      load: data.realm ? true : false,
    },
    {
      name: 'apiToken',
      label: 'token',
      type: 'text',
      value: form?.apiToken || data.apiToken,
      toggle: true,
      visible: false,
      load: data.apiToken ? true : false,
    },
    {
      name: 'nodes',
      label: 'nodes',
      type: 'text',
      value: form?.nodes || data.nodes,
      load: data.nodes ? true : false,
    },
  ]);
  let pending = $state(false);

  $effect(() => {
    if (form) {
      formInput.forEach((input) => {
        if (form && input.name) {
          input.value = form[input.name as keyof typeof form];
        }
      });
    }
  });
</script>

<div class="m-auto w-96 border-1 border-neutral-600 bg-neutral-800 px-2">
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
      {#if !input.load}
        <div class="relative flex w-full flex-row items-center pb-1">
          <label for={input.name} class="w-2/8">{input.label}</label>
          <input
            type={input.toggle ? (input.visible ? 'text' : 'password') : input.type}
            name={input.name}
            required
            value={input.value || ''}
            class="w-6/8 border border-neutral-600 disabled:text-neutral-600"
          />
          {#if input.toggle}
            <button
              type="button"
              onmousedown={() => (input.visible = !input.visible)}
              onmouseup={() => (input.visible = !input.visible)}
              onmouseleave={() => (input.visible = false)}
              class="absolute right-0 mr-[1px] cursor-pointer bg-neutral-800 px-2 text-neutral-600"
              aria-label={input.visible ? 'Hide password' : 'Show password'}
            >
              {#if input.visible}
                <Eye size={18} />
              {:else}
                <EyeOff size={18} />
              {/if}
            </button>
          {/if}
        </div>
      {/if}
    {/each}
    <button
      type="submit"
      disabled={pending}
      class="cursor-pointer bg-amber-600 px-4 py-1 text-white hover:bg-amber-500"
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
</div>
