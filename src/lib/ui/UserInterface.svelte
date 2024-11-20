<script lang="ts">
  import { root_el } from "./ui.svelte.js";
  interface Props {
    children?: import("svelte").Snippet;
    ui?: import("svelte").Snippet;
  }

  let { children, ui }: Props = $props();
</script>

<main class="stack">
  <div class="game">
    {@render children?.()}
  </div>

  <div class="ui-root roboto-mono">
    <div bind:this={$root_el} class="ui-interactive"></div>
    {@render ui?.()}
  </div>
</main>

<style>
  .stack {
    display: grid;
  }

  .stack > * {
    grid-area: 1 / 1;
  }

  .game {
    z-index: 1;
  }

  .ui-root {
    padding: 1rem 1rem;
    z-index: 2;
    pointer-events: none;
  }
  .ui-interactive {
    pointer-events: all;
  }
  .roboto-mono {
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }
</style>
