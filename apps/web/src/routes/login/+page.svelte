<script lang="ts">
  import { LoginDTO } from "@barbord/contract";
  import Button from "../../components/button.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1>Login Page</h1>

<form>
  <!-- <div>
    <label for="username">Username</label>
    <input id="username" type="text" bind:value={values.username} />
    {#if errors.username.length > 0}
      {#each errors.username as error}
        <p class="error">{error}</p>
      {/each}
    {/if}
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" type="password" bind:value={values.password} />
    {#if errors.password.length > 0}
      {#each errors.password as error}
        <p class="error">{error}</p>
      {/each}
    {/if}
  </div> -->

  <Button type="submit">Login</Button>
</form>
