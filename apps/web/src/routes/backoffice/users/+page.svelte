<script lang="ts">
  import {
    ArrowDown01,
    ArrowDown10,
    ArrowDownAZ,
    ArrowDownZA,
    ClockArrowDown,
    FunnelX,
    Pencil,
  } from "lucide-svelte";
  import Button from "../../../components/button.svelte";
  import type { PageProps } from "./$types";
  import { useSearch } from "$lib/search.svelte";
  import Saldo from "../../../components/renderers/saldo.svelte";

  let { data }: PageProps = $props();
  const users = $derived(data.users);
  const settings = $derived(data.settings);

  const search = useSearch(() => users, {
    searchFields: ["name", "email", "phonenumber"],
    initialSort: ["name", "asc"],
  });
</script>

<h1 class="title">Users</h1>

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
          <td>{user.email}</td>
          <td>{user.phonenumber}</td>
          <td>{user.lastorder || "Geen"}</td>
          <td>
            <Saldo saldo={user.saldo} {settings} />
          </td>
          <td>
            {#if user.saldoReminders > 0}
              <div
                class="bg-red-300 text-red-900 dark:bg-red-700 dark:text-white font-bold font-mono h-9 px-2 rounded flex items-center justify-center"
              >
                {user.saldoReminders}x
              </div>
            {/if}
          </td>
          <td>
            <div class="flex gap-2">
              {#if user.exemptForFines}
                <div
                  class="bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-white font-mono h-9 px-2 rounded flex items-center justify-center"
                >
                  Boetes
                </div>
              {/if}
              {#if user.exemptForReminders}
                <div
                  class="bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-white font-mono h-9 px-2 rounded flex items-center justify-center"
                >
                  Herinneringen
                </div>
              {/if}
            </div>
          </td>
          <td>
            <div class="button-group">
              <Button href={`/backoffice/users/${user.id}/edit`} size="icon">
                <Pencil />
              </Button>
              <Button href={`/backoffice/orders/users/${user.id}`} size="icon"
              ></Button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
