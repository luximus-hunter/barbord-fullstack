<script lang="ts">
  import { Box, LogOut, Menu, Monitor, UserRound, X } from "lucide-svelte";
  import Button from "../../components/button.svelte";
  import Titlebar from "../../components/titlebar.svelte";
  import { sveltekitLogout } from "$lib/auth.js";

  let { children, data } = $props();
  let { settings } = $derived(data);
  let isMenuOpen = $state(false);

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<Titlebar title={settings.websiteTitle + " - Backoffice"}>
  <Button
    variant="secondary"
    onclick={toggleMenu}
    size="icon"
    class="lg:hidden"
  >
    <Menu />
  </Button>
  <Button variant="secondary" href="/" size="icon">
    <Monitor />
    <div class="hidden lg:block whitespace-nowrap">Shop</div>
  </Button>
  <Button variant="secondary" href="/backoffice" size="icon">
    <Box />
    <div class="hidden lg:block whitespace-nowrap">Backoffice</div>
  </Button>
  <Button variant="danger" onclick={sveltekitLogout} size="icon">
    <LogOut />
    <div class="hidden lg:block whitespace-nowrap">Uitloggen</div>
  </Button>
</Titlebar>

<div class="flex flex-1 overflow-auto">
  {#if isMenuOpen}
    <button
      class="fixed inset-0 bg-black/40 z-20"
      onclick={closeMenu}
      aria-label="Sluit menu"
    ></button>
  {/if}

  <div
    id="backoffice-menu"
    class="border-r border-primary w-64 background-secondary flex flex-col p-2 fixed inset-y-0 left-0 z-30 transform transition-transform duration-200 lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 {isMenuOpen
      ? 'translate-x-0'
      : '-translate-x-full'}"
  >
    <h2 class="text-lg font-bold mb-4">Menu</h2>
    <nav class="flex flex-col gap-2">
      <Button variant="menu" href="/backoffice/users" onclick={closeMenu}>
        <UserRound />
        <span>Users</span>
      </Button>
      <Button variant="menu" href="/backoffice/products" onclick={closeMenu}>
        <Box />
        <span>Products</span>
      </Button>
      <Button variant="menu" href="/backoffice/orders" onclick={closeMenu}>
        <Box />
        <span>Orders</span>
      </Button>
    </nav>
  </div>
  <div class="p-2 overflow-auto flex-1 flex flex-col gap-2">
    {@render children()}
  </div>
</div>
