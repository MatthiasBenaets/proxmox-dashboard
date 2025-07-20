<script lang="ts">
  import { Container, Monitor } from '@lucide/svelte';

  let { data } = $props();
  const { vms, error } = data;

  if (vms) vms.sort((a, b) => a.vmid - b.vmid);
</script>

<div class="h-full w-full">
  <div class="grid h-full grid-cols-4 xl:grid-cols-5">
    <div class="m-2 mr-1 border border-neutral-600 bg-neutral-800 p-2 px-3.5">
      <div class="flex flex-col">
        <details open>
          <summary>Datacenter</summary>
          {#if vms && vms.length != 0}
            {#each Object.entries(vms.reduce((acc: Record<string, typeof vms>, vm) => {
                if (!acc[vm.node]) acc[vm.node] = [];
                acc[vm.node].push(vm);
                return acc;
              }, {})) as [node, nodeVms] (node)}
              <details open class="pl-4">
                <summary>{node}</summary>
                {#each nodeVms as vm (vm.vmid)}
                  <div class="pl-4">
                    <button class="text-left">
                      <a href="/dashboard/{vm.vmid}?node={vm.node}&type={vm.type}">
                        {vm.vmid} ({vm.name})
                      </a>
                    </button>
                  </div>
                {/each}
              </details>
            {/each}
          {/if}
        </details>
      </div>
    </div>
    <div class="col-span-3 m-2 ml-1 border border-neutral-600 bg-neutral-800 xl:col-span-4">
      <div class="flex flex-col">
        <div class="flex h-10 w-full flex-row items-center border-b-1 border-neutral-600">
          <div class="w-1/5 pl-2">Type</div>
          <div class="w-1/5">Description</div>
          <div class="w-1/5">Disk usage</div>
          <div class="w-1/5">Memory usage</div>
          <div class="w-1/5">Uptime</div>
        </div>

        {#if vms && vms.length != 0}
          {#each vms as vm, index (vm.vmid)}
            <a href="/dashboard/{vm.vmid}?node={vm.node}&type={vm.type}">
              <div
                class="flex h-10 w-full flex-row {index % 2 == 0
                  ? 'bg-neutral-900'
                  : ''} items-center hover:bg-neutral-700/50"
              >
                <div class="flex w-1/5 flex-row pl-2">
                  <div class="relative">
                    {#if vm.type == 'lxc'}
                      <Container size={20} />
                    {:else}
                      <Monitor size={20} />
                    {/if}
                    {#if vm.status == 'running'}
                      <div class="absolute -top-2 -right-3">
                        <svg
                          class="h-7 w-7 text-green-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    {/if}
                  </div>
                  <div class="pl-2">
                    {vm.type || 'qemu'}
                  </div>
                </div>
                <div class="w-1/5">
                  {vm.vmid} ({vm.name})
                </div>
                <div class="w-1/5">
                  {#if vm.disk}
                    {(vm.disk / 1_000_000_000).toFixed(1)} / {(vm.maxdisk / 1_000_000_000).toFixed(
                      1
                    )}
                    GB ({((vm.disk / vm.maxdisk) * 100).toFixed(1)} %)
                  {:else}
                    -
                  {/if}
                </div>
                <div class="w-1/5">
                  {((vm.mem / vm.maxmem) * 100).toFixed(1)} %
                </div>
                <div class="w-1/5">
                  {(vm.uptime / 60 / 60 / 24).toFixed(0)} days
                </div>
              </div>
            </a>
          {/each}
        {/if}
      </div>
    </div>
  </div>
  <!-- <p>{error}</p> -->
</div>
