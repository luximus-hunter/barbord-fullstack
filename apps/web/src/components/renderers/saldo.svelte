<script lang="ts">
  import { cn } from "$lib/utils";
  import type { SettingsDTO } from "@barbord/contract";

  let { saldo, settings }: { saldo: number; settings: SettingsDTO } = $props();
  let { fineAt, warnAt } = $derived(settings);

  let colors = $derived(
    saldo <= fineAt
      ? "bg-red-300 text-red-900 font-bold dark:bg-red-700 dark:text-white"
      : saldo < 0
        ? "bg-red-200 text-red-900 dark:bg-red-500 dark:text-white"
        : saldo === 0
          ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-white"
          : saldo <= warnAt
            ? "bg-orange-200 text-orange-900 dark:bg-orange-500 dark:text-white"
            : "bg-green-200 text-green-900 dark:bg-green-500 dark:text-white",
  );
</script>

<div class={cn("font-mono h-9 px-2 rounded flex items-center justify-center", colors)}>
  €{saldo.toFixed(2)}
</div>
