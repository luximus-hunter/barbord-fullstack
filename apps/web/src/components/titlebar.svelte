<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./button.svelte";
  import { Maximize2, Minimize2, Minus, X } from "lucide-svelte";

  interface Props {
    title: string;
    children?: any;
  }

  let { title, children }: Props = $props();

  // Check if running in Tauri desktop environment
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

  let appWindow = $state<any>();
  let isMaximized = $state(false);
  let allowResize = $state(isTauri);

  const initTauri = async () => {
    if (isTauri) {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const appWindowIntermediary = getCurrentWindow();

      const unlisten = await appWindowIntermediary.onResized(() => {
        appWindowIntermediary.isMaximized().then((maximized) => {
          isMaximized = maximized;
        });
      });

      appWindow = appWindowIntermediary;

      isMaximized = await appWindow.isMaximized();
      allowResize =
        (await appWindow.isResizable()) && !(await appWindow.isFullscreen());

      return { appWindow, unlisten };
    }
  };

  function minimize() {
    appWindow?.minimize();
  }

  function maximize() {
    appWindow?.toggleMaximize();
  }

  function close() {
    appWindow?.close();
  }

  onMount(() => {
    let cleanup: (() => void) | undefined;

    initTauri().then((result) => {
      cleanup = result?.unlisten;
    });

    return () => {
      cleanup?.();
    };
  });
</script>

<header
  class="border-b border-primary background-secondary flex items-center justify-between"
  style={allowResize ? "-webkit-app-region: drag;" : ""}
>
  <h1 class="font-bold text-3xl p-2 truncate">{title}</h1>
  <nav
    class="flex items-center w-fit"
    style={allowResize ? "-webkit-app-region: no-drag;" : ""}
  >
    {#if children}
      <div class="items-center gap-2 p-2 hidden sm:flex">
        {@render children()}
      </div>
    {/if}
    {#if isTauri && allowResize}
      <div class="flex items-center gap-2 p-2 border-l border-primary">
        <Button size="square" variant="secondary" onclick={minimize}>
          <Minus />
        </Button>
        <Button size="square" variant="secondary" onclick={maximize}>
          {#if isMaximized}
            <Minimize2 />
          {:else}
            <Maximize2 />
          {/if}
        </Button>
        <Button size="square" variant="danger" onclick={close}>
          <X />
        </Button>
      </div>
    {/if}
  </nav>
</header>

{#if children}
  <div class="items-center gap-2 p-2 sm:hidden flex border-primary border-b background-secondary">
    {@render children()}
  </div>
{/if}
