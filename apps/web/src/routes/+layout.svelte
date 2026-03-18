<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children, data } = $props();
  let { kioskMode } = $derived(data);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if kioskMode}
  <div class="select-none h-screen flex flex-col overflow-hidden">
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
