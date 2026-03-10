<script lang="ts">
  import Button from "../../components/button.svelte";
  import type { PageProps } from "./$types";
  
  let { data }: PageProps = $props();

  $effect(() => {
    console.log(data.admins);
  });
</script>

<h1>Login Page</h1>