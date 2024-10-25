<script lang="ts">
  import { root_el } from "./ui.js";
</script>

<main class="stack">
  <div class="game">
    <slot />
  </div>

  <div class="ui-root roboto-mono">
    <div bind:this={$root_el} class="ui-interactive" />
    <slot name="ui" />
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
