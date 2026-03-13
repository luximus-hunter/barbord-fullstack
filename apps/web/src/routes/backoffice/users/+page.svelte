<script lang="ts">
  import type { PageProps } from "./$types";
  import { UserDTO } from "@barbord/contract";
  import ZodTable from "../../../components/zod-table.svelte";
  import type { ZodTableProps } from "../../../components/zod-table";

  let { data }: PageProps = $props();

  const users = $derived(data.users);
</script>
