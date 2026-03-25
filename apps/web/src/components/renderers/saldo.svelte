<script lang="ts">
  import { type ColorStyles } from "$lib/colorstyles";
  import type { SettingsDTO } from "@barbord/contract";
  import Generic from "./generic.svelte";

  let { saldo, settings }: { saldo: number; settings: SettingsDTO } = $props();
  let { fineAt, warnAt } = $derived(settings);

  let color: ColorStyles = $derived(
    saldo <= fineAt
      ? "crimson"
      : saldo < 0
        ? "red"
        : saldo === 0
          ? "neutral"
          : saldo <= warnAt
            ? "orange"
            : "green",
  );
</script>

<Generic {color}>€{saldo.toFixed(2)}</Generic>
