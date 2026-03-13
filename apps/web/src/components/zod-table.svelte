<script lang="ts">
  import { cn } from "$lib/utils";
  import type { ZodTableProps } from "./zod-table";

  let { schema, data, renderers }: ZodTableProps<any> = $props();
</script>
