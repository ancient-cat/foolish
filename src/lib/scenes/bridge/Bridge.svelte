<script lang="ts" context="module">
  export type State = {
    title: Writable<string>;
    mouse: Writable<{ x: number; y: number }>;
  };

  export type Events = {
    reset: undefined;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Writable } from "svelte/store";
  const dispatch = createEventDispatcher();

  export let title: string;
  export let mouse: { x: number; y: number };
  export let count: number = 0;

  function onClick() {
    dispatch("click", count);
  }

  function onMouseMove(e: MouseEvent) {
    dispatch("mousemove", { x: e.x, y: e.y });
  }
</script>

<svelte:window on:mousemove={onMouseMove} />

<h1>{title}</h1>

<button on:click={() => (count -= 1)}>-</button>
<button on:click={onClick}>{count}</button>
<button on:click={() => (count += 1)}>+</button>
<pre style="margin: 1rem;">{JSON.stringify(mouse)}</pre>
