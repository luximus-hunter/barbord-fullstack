<script lang="ts">
  import { LoginDTO } from "@barbord/contract";
  import { superForm, setMessage, setError } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import Button from "../../components/button.svelte";
  import { sveltekitLogin, sveltekitLogout } from "$lib/auth.js";
  import { Gateway } from "@barbord/gateway";
  import Titlebar from "../../components/titlebar.svelte";
  import {
    Box,
    CircleStar,
    LogIn,
    LogOut,
    Monitor,
    RotateCcw,
  } from "lucide-svelte";

  let { data } = $props();
  let { admins, kioskMode, settings, me } = $derived(data);

  const { form, errors, message, constraints, enhance } = superForm(
    (() => data.form)(),
    {
      SPA: true,
      validators: zod4(LoginDTO),
      async onUpdate({ form }) {
        if (!form.valid) {
          setMessage(form, "Ongeldige invoer.");
          return;
        }

        setMessage(form, "Inloggen...");

        Gateway.auth
          .login(form.data)
          .then(() => {
            setMessage(form, "Login succesvol!");
          })
          .catch((err) => {
            setMessage(form, "Login mislukt, onjuist wachtwoord.");
          })
          .finally(sveltekitLogin);
      },
    },
  );
</script>

<Titlebar title={settings.websiteTitle}>
  <Button variant="secondary" onclick={() => location.reload()} size="icon">
    <div class="hidden lg:block whitespace-nowrap">Herlaad</div>
    <RotateCcw />
  </Button>
  {#if !!me}
    <Button variant="secondary" size="icon">
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
  {:else}
    <Button href="/login" variant="secondary" size="icon">
      <div class="hidden lg:block whitespace-nowrap">Log in</div>
      <LogIn />
    </Button>
  {/if}
</Titlebar>

{#if $message}<h3>{$message}</h3>{/if}

<div class="flex flex-col gap-4 p-4 items-center sm:justify-center flex-1">
  <form method="POST" use:enhance class="card max-w-md w-full">
    <h1 class="text-2xl font-bold">Login</h1>

    <label>
      Admin<br />
      <select
        autocomplete="username"
        aria-invalid={$errors.username ? "true" : undefined}
        bind:value={$form.username}
        {...$constraints.username}
      >
        <option value="">Select an admin</option>
        {#each admins as admin}
          <option value={admin.username}>{admin.displayname}</option>
        {/each}
      </select>
    </label>
    {#if $errors.username}<span class="invalid">{$errors.username}</span>{/if}

    <label>
      Password<br />
      <input
        type="password"
        autocomplete="current-password"
        aria-invalid={$errors.password ? "true" : undefined}
        bind:value={$form.password}
        {...$constraints.password}
      />
    </label>
    {#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}

    <Button type="submit" variant="primary" size="lg">
      Login
      <LogIn />
    </Button>
  </form>

  {#if kioskMode}
    <div class="card max-w-lg flex flex-col gap-4 w-full">
      <Button type="button" variant="secondary" size="lg" href="/">
        Shop
        <Monitor />
      </Button>
    </div>
  {/if}
</div>
