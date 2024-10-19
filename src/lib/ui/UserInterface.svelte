<script lang="ts">
  import { root_el } from "./ui.js";

  // let component: ComponentType | undefined = undefined;
  // let state: Readable<any> | undefined = undefined;
  // let events: EventDispatcher<Record<string, any>> | undefined = undefined;

  // $: events = $current_ui?.events;
  // $: console.log("current_ui, from UserInterface.svelte:", $current_ui);
</script>

<main class="stack">
  <div class="game">
    <slot />
  </div>

  <div class="ui-root roboto-mono">
    <!-- <svelte:component this={component} {state} {events} /> -->
    <div bind:this={$root_el} />
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
  }
  .roboto-mono {
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }
</style>
