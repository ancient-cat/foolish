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
</script>

<button on:click={onClick}>{count}</button>
