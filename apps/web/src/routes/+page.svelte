<script lang="ts">
  import Hono from "../components/logos/hono.svelte";
  import Oxc from "../components/logos/oxc.svelte";
  import Prisma from "../components/logos/prisma.svelte";
  import Rolldown from "../components/logos/rolldown.svelte";
  import Superform from "../components/logos/superform.svelte";
  import Svelte from "../components/logos/svelte.svelte";
  import Tailwindcss from "../components/logos/tailwindcss.svelte";
  import Tsdown from "../components/logos/tsdown.svelte";
  import Turborepo from "../components/logos/turborepo.svelte";
  import Vite from "../components/logos/vite.svelte";
  import Zod from "../components/logos/zod.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  $effect(() => {
    console.log(data.shop);
  });
</script>

<h1>{data.shop.settings.websiteTitle}</h1>

<h2>Web</h2>

<div class="grid grid-cols-4 gap-2 p-2 w-fit">
  <Vite />
  <Oxc />
  <Svelte />
  <Zod />
  <Superform />
  <Tailwindcss />
</div>

<h2>Api</h2>

<div class="grid grid-cols-4 gap-2 p-2 w-fit">
  <Hono />
  <Oxc />
  <Prisma />
  <Zod />
</div>

<h2>Packages</h2>

<div class="grid grid-cols-4 gap-2 p-2 w-fit">
  <Turborepo />
  <Oxc />
  <Tsdown />
  <Zod />
</div>
