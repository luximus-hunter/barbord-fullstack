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
    <RotateCcw />
    <div class="hidden lg:block whitespace-nowrap">Herlaad</div>
  </Button>
  <Button variant="secondary" size="icon">
    <CircleStar />
    <div class="hidden lg:block whitespace-nowrap">Statistieken</div>
  </Button>
  {#if !!me}
    <Button variant="secondary" href="/backoffice" size="icon">
      <Box />
      <div class="hidden lg:block whitespace-nowrap">Backoffice</div>
    </Button>
    <Button variant="danger" onclick={sveltekitLogout} size="icon">
      <LogOut />
      <div class="hidden lg:block whitespace-nowrap">Uitloggen</div>
    </Button>
  {:else}
    <Button href="/login" variant="secondary" size="icon">
      <LogIn />
      <div class="hidden lg:block whitespace-nowrap">Inloggen</div>
    </Button>
  {/if}
</Titlebar>

<h1>Shop</h1>
