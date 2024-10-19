<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let target: HTMLElement;

  onMount(() => {
    dispatch("ready", target);

    return () => {
      dispatch("dismount");
    };
  });
</script>

<div class="game-target" bind:this={target} />

<style>
  .game-target {
    margin: 0;
    padding: 0;
    scroll-snap-type: none;
  }
</style>
