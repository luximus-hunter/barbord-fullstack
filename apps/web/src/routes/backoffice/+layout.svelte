<script lang="ts">
  import { Box, LogOut, Monitor } from "lucide-svelte";
  import Button from "../../components/button.svelte";
  import Titlebar from "../../components/titlebar.svelte";
  import { sveltekitLogout } from "$lib/auth.js";

  let { children, data } = $props();
  let { kioskMode, settings } = $derived(data);
</script>

<Titlebar title={settings.websiteTitle + " - Backoffice"}>
  <Button variant="secondary" href="/" size="icon">
    <div class="hidden lg:block whitespace-nowrap">Shop</div>
    <Monitor />
  </Button>
  <Button variant="secondary" href="/backoffice" size="icon">
    <div class="hidden lg:block whitespace-nowrap">Backoffice</div>
    <Box />
  </Button>
  <Button variant="danger" onclick={sveltekitLogout} size="icon">
    <div class="hidden lg:block whitespace-nowrap">Log out</div>
    <LogOut />
  </Button>
</Titlebar>

{#if kioskMode}
  <div class="select-none min-h-screen flex flex-col">
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
