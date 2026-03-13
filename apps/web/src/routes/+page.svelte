<script lang="ts">
  import { sveltekitLogout } from "$lib/auth";
  import { CircleStar, Box, LogIn, LogOut, RotateCcw } from "lucide-svelte";
  import Button from "../components/button.svelte";
  import Titlebar from "../components/titlebar.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let { settings, shop, me } = $derived(data);
</script>

<Titlebar title={settings.websiteTitle}>
  <Button variant="secondary" onclick={() => location.reload()} size="icon">
    <div class="hidden lg:block whitespace-nowrap">Herlaad</div>
    <RotateCcw />
  </Button>
  <Button variant="secondary" size="icon">
    <div class="hidden lg:block whitespace-nowrap">Statistieken</div>
    <CircleStar />
  </Button>
  {#if !!me}
    <Button variant="secondary" href="/backoffice" size="icon">
      <div class="hidden lg:block whitespace-nowrap">Backoffice</div>
      <Box />
    </Button>
    <Button variant="danger" onclick={sveltekitLogout} size="icon">
      <div class="hidden lg:block whitespace-nowrap">Log out</div>
      <LogOut />
    </Button>
  {:else}
    <Button href="/login" variant="secondary" size="icon">
      <div class="hidden lg:block whitespace-nowrap">Log in</div>
      <LogIn />
    </Button>
  {/if}
</Titlebar>

<h1>Shop</h1>
