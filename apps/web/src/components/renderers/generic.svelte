<script lang="ts">
  import { colorStyles, type ColorStyles } from "$lib/colorstyles";
  import { cn } from "$lib/utils";

  let { children, color }: { children: () => any; color: ColorStyles } =
    $props();
</script>

<div
  class={cn(
    "font-mono h-9 px-2 rounded flex items-center justify-center text-nowrap",
    colorStyles[color],
  )}
>
  {@render children()}
</div>
