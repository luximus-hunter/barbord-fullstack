<script lang="ts">
  import {
    ArrowDown01,
    ArrowDown10,
    ArrowDownAZ,
    ClockArrowDown,
    FunnelX,
    Pencil,
    Archive,
    Plus,
  } from "lucide-svelte";
  import Button from "../../../components/button.svelte";
  import type { PageProps } from "./$types";
  import { useSearch } from "$lib/search.svelte";
  import Saldo from "../../../components/renderers/saldo.svelte";
  import Generic from "../../../components/renderers/generic.svelte";
  import Date from "../../../components/renderers/date.svelte";

  let { data }: PageProps = $props();
  const users = $derived(data.users);
  const settings = $derived(data.settings);

  const search = useSearch(() => users, {
    searchFields: ["name", "email", "phonenumber"],
    initialSort: ["name", "asc"],
  });

  function archiveUser(userId: number) {
    if (confirm("Weet je zeker dat je deze gebruiker wilt archiveren?")) {
      alert("Deze functie is nog niet geïmplementeerd.");
    }
  }
</script>

<div class="flex justify-between items-center">
  <h1 class="title">Users</h1>
  <div>
    <Button href="/backoffice/users/new" size="icon">
      <Plus />
      <div class="hidden lg:block whitespace-nowrap">Nieuwe gebruiker</div>
    </Button>
  </div>
</div>

<div class="flex gap-2 items-end">
  <label for="search" class="flex-1">
    Zoeken
    <input
      id="search"
      type="text"
      placeholder="Zoeken"
      bind:value={search.value}
    />
  </label>
  <Button
    variant={search.allowReset ? "danger" : "secondary"}
    size="icon"
    onclick={search.reset}
  >
    <FunnelX />
    <span>Reset</span>
  </Button>
</div>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>
          <div class="flex gap-2">
            <Button
              variant={search.currentSort === "name" ? "primary" : "secondary"}
              size="sort"
              onclick={() => search.sort("name", "asc")}
            >
              <ArrowDownAZ />
            </Button>
            <span>Naam</span>
          </div>
        </th>
        <th>Email</th>
        <th>Telefoon</th>
        <th>
          <div>
            <Button
              variant={search.currentSort === "lastorder"
                ? "primary"
                : "secondary"}
              size="sort"
              onclick={() => search.sort("lastorder", "desc")}
            >
              <ClockArrowDown />
            </Button>
            <span>Laatste bestelling</span>
          </div>
        </th>
        <th>
          <div>
            <Button
              variant={search.currentSort === "saldo" ? "primary" : "secondary"}
              size="sort"
              onclick={() => search.sort("saldo", "asc")}
            >
              <ArrowDown01 />
            </Button>
            <span>Saldo</span>
          </div>
        </th>
        <th>
          <div>
            <Button
              variant={search.currentSort === "saldoReminders"
                ? "primary"
                : "secondary"}
              size="sort"
              onclick={() => search.sort("saldoReminders", "desc")}
            >
              <ArrowDown10 />
            </Button>
            <span>Saldo herinneringen</span>
          </div>
        </th>
        <th>Vrijstellingen</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {#each search.filteredItems as user}
        <tr>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>
            {#if user.email}
              <a
                href={`mailto:${user.email}`}
                class="text-blue-500 hover:underline"
              >
                {user.email}
              </a>
            {:else}
              Onbekend
            {/if}
          </td>
          <td>
            {#if user.phonenumber}
              <a
                href={`tel:${user.phonenumber}`}
                class="text-blue-500 hover:underline"
              >
                {user.phonenumber}
              </a>
            {:else}
              Onbekend
            {/if}
          </td>
          <td>
            {#if user.lastorder}
              <Date date={user.lastorder} />
            {/if}
          </td>
          <td>
            <Saldo saldo={user.saldo} {settings} />
          </td>
          <td>
            {#if user.saldoReminders > 0}
              <Generic color="crimson">{user.saldoReminders}x</Generic>
            {/if}
          </td>
          <td>
            <div class="flex gap-2">
              {#if user.exemptForFines}
                <Generic color="neutral">Boetes</Generic>
              {/if}
              {#if user.exemptForReminders}
                <Generic color="neutral">Herinneringen</Generic>
              {/if}
            </div>
          </td>
          <td>
            <div class="button-group">
              <Button href={`/backoffice/users/${user.id}`} size="icon">
                <Pencil />
              </Button>
              <Button
                onclick={() => archiveUser(user.id)}
                size="icon"
                variant="danger"
              >
                <Archive />
              </Button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
