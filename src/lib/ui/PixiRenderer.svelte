<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    onReady?: (target: HTMLElement) => void;
    onDismount?: () => void;
  }
  const { onReady, onDismount }: Props = $props();

  let target: HTMLElement | undefined = $state();

  onMount(() => {
    if (target !== undefined) {
      onReady?.(target);
    }

    return () => {
      onDismount?.();
    };
  });
</script>

<div class="game-target" bind:this={target}></div>

<style>
  .game-target {
    margin: 0;
    padding: 0;
    scroll-snap-type: none;
  }
</style>
