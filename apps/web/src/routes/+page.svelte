<script lang="ts">
  import Button from "../components/button.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  $effect(() => {
    console.log(data.shop);
  });
</script>

<h1>{data.shop.settings.websiteTitle}</h1>

<Button href="/login">Login</Button>
