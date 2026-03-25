<script lang="ts">
  import { cn } from "$lib/utils";
  import type {
    HTMLButtonAttributes,
    HTMLAnchorAttributes,
  } from "svelte/elements";

  const baseStyles =
    "rounded font-semibold flex-1 w-full h-9 text-center transition-colors duration-100 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const buttonSizes = {
    xs: "px-1 py-0.5 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-1.5 text-md",
    lg: "px-6 py-2 text-lg",
    xl: "px-8 py-2.5 text-xl",
    icon: "h-9 whitespace-nowrap p-2 aspect-square flex-0",
    square: "h-9 w-9 p-0 aspect-square flex-0",
    sort: "h-6 w-6 aspect-square flex-0",
  };

  const buttonVariants = {
    primary:
      "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-900",
    secondary:
      "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white",
    success:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500",
    danger:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500",
    menu: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white flex items-center gap-2 justify-start px-4 py-2",
  };

  type ButtonSize = keyof typeof buttonSizes;
  type ButtonVariant = keyof typeof buttonVariants;

  type Props = (HTMLButtonAttributes | HTMLAnchorAttributes) & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    icon?: boolean;
    children?: () => any;
  };

  let { children, variant, size, href, class: userClass, ...props }: Props =
    $props();

  const className = $derived(
    cn(
      baseStyles,
      buttonVariants[variant || "primary"],
      buttonSizes[size || "md"],
      userClass,
    ),
  );
</script>

{#if href}
  <a {href} class={className} {...props as HTMLAnchorAttributes}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button
    onclick={props["onclick"] as () => void}
    class={className}
    {...props as HTMLButtonAttributes}
  >
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}
