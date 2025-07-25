<script lang="ts">
  import { Info, Server, Cpu, MemoryStick, HardDrive } from '@lucide/svelte';
  import Top from '$lib/components/body/parts/Top.svelte';
  import { timeFormat } from '$lib/utils';
  let { params, vm } = $props();
</script>

{#if vm}
  <Top>
    <div class="flex flex-row justify-between">
      <p>
        {#if vm.type == 'lxc'}
          Container
        {:else}
          Virtual Machine
        {/if}
        {vm.vmid} ({vm.name}) on node '{params.node}'
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex justify-center border border-amber-600 bg-neutral-600 px-5">Overview</div>
        <a
          class="flex justify-center border border-neutral-500 bg-neutral-600 px-5 hover:bg-neutral-500"
          href="/dashboard?vmid={params.vmid}&node={params.node}&type={params.type}&remote=1"
        >
          Connect
        </a>
      </div>
    </div>
  </Top>
  <div class="grid grid-cols-[55%_auto] gap-2 p-2">
    <div class="flex flex-col border border-neutral-600">
      <div class="flex h-6 w-full items-center border-b border-neutral-600 bg-neutral-700/50 px-2">
        {vm.name} (Uptime: {timeFormat(vm.uptime)})
      </div>
      <div class="grid grid-cols-1 gap-2 px-8 py-4">
        <div class="flex flex-row justify-between">
          <div class="flex flex-row items-center">
            <Info size={15} class="mr-1" /> Status
          </div>
          <p>
            {vm.status}
          </p>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-row items-center">
            <Server size={15} class="mr-1" /> Node
          </div>
          <p>
            {params.node}
          </p>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-row items-center">
            <Cpu size={15} class="mr-1" /> CPU usage
          </div>
          <p>
            {(vm.cpu * 100).toFixed(2)}% of {vm.cpus} CPU(s)
          </p>
        </div>
        <div class="flex h-1 w-full justify-start bg-neutral-400">
          <div
            class="h-full {Math.round(vm.cpu * 100) > 80 ? 'bg-red-400' : 'bg-blue-400'}"
            style="width: {(vm.cpu * 100).toFixed(2)}%"
          ></div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-row items-center">
            <MemoryStick size={15} class="mr-1" /> Memory usage
          </div>
          <p>
            {#if vm.maxmem > 1_073_741_823}
              {((vm.mem / vm.maxmem) * 100).toFixed(2)}%
              <span class="text-xs">
                ({(vm.mem / 1_073_741_824).toFixed(2)} GiB of
                {(vm.maxmem / 1_073_741_824).toFixed(2)} GiB)
              </span>
            {:else}
              {((vm.mem / vm.maxmem) * 100).toFixed(2)}%
              <span class="text-xs">
                ({(vm.mem / 1_048_576).toFixed(2)} MiB of
                {(vm.maxmem / 1_048_576).toFixed(2)} MiB)
              </span>
            {/if}
          </p>
        </div>
        <div class="flex h-1 w-full justify-start bg-neutral-400">
          <div
            class="h-full {(vm.mem / vm.maxmem) * 100 > 80 ? 'bg-red-400' : 'bg-blue-400'}"
            style="width: {((vm.mem / vm.maxmem) * 100).toFixed(2)}%"
          ></div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-row items-center">
            <HardDrive size={15} class="mr-1" /> Bootdisk size
          </div>
          <p>
            {#if vm.maxdisk > 1_073_741_823}
              {(((vm.disk || 0) / vm.maxdisk) * 100).toFixed(2)}%
              <span class="text-xs"
                >({((vm.disk || 0) / 1_073_741_824).toFixed(2)} GiB / {(
                  vm.maxdisk / 1_073_741_824
                ).toFixed(2)} GiB</span
              >)
            {:else}
              {(((vm.disk || 0) / vm.maxdisk) * 100).toFixed(2)}%
              <span class="text-xs">
                ({((vm.disk || 0) / 1_048_576).toFixed(2)} MiB /
                {(vm.maxdisk / 1_048_576).toFixed(2)} MiB)
              </span>
            {/if}
          </p>
        </div>
        <div class="flex h-1 w-full justify-start bg-neutral-400">
          <div
            class="h-full {(vm.mem / vm.maxmem) * 100 > 80 ? 'bg-red-400' : 'bg-blue-400'}
"
            style="width:{(((vm.disk || 0) / vm.maxdisk) * 100).toFixed(0)}%"
          ></div>
        </div>
      </div>
    </div>
    <div class="flex flex-col border border-neutral-600"></div>
  </div>
{/if}
