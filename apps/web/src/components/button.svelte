<script lang="ts">
  import { cn } from "$lib/utils";
  import type {
    HTMLButtonAttributes,
    HTMLAnchorAttributes,
  } from "svelte/elements";

  const baseStyles = "rounded font-semibold flex-1 w-full h-9 block text-center";

  const buttonSizes = {
    xs: "px-1 py-0.5 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-1.5 text-md",
    lg: "px-6 py-2 text-lg",
    xl: "px-8 py-2.5 text-xl",
  };

  const buttonVariants = {
    primary:
      "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500",
    secondary:
      "bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-400 dark:hover:bg-rose-500",
    neutral:
      "bg-stone-300 text-stone-800 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-700 dark:text-white",
    success:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500",
    danger:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500",
  };

  type ButtonSize = keyof typeof buttonSizes;
  type ButtonVariant = keyof typeof buttonVariants;

  type Props = (HTMLButtonAttributes | HTMLAnchorAttributes) & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    children?: () => any;
  };

  let { children, variant, size, href, ...props }: Props = $props();

  const className = cn(
    baseStyles,
    buttonVariants[variant || "primary"],
    buttonSizes[size || "md"],
    props.class,
  );
</script>

{#if href}
  <a {href} class={className} {...props}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button onclick={props["onclick"]} class={className} {...props}>
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}
