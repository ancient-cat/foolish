<script lang="ts" context="module">
  export type State = {
    title: string;
    count: number;
  };

  export type Events = {
    add: number;
    subtract: number;
    reset: undefined;
  };
</script>

<script lang="ts">
  import type { EventDispatcher } from "$lib/core/dispatcher.js";
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";

  export let events: EventDispatcher<Events>;
  export let state: Writable<State>;

  function add() {
    $state.count += 1;
    events.emit("add", $state.count);
  }

  function subtract() {
    $state.count -= 1;
    events.emit("subtract", $state.count);
  }

  function reset() {
    events.emit("reset");
  }
</script>

<h1>{$state.title}</h1>

<button on:click={reset}>Reset</button>

<button on:click={subtract}> - </button>
{$state.count}
<button on:click={add}> + </button>
