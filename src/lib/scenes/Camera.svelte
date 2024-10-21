<script lang="ts" context="module">
  export type State = {
    title: string;
  };

  export type Events = {
    reset: undefined;
  };
</script>

<script lang="ts">
  import type { EventDispatcher } from "$lib/core/dispatcher.js";
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";

  export let events: EventDispatcher<Events>;
  export let state: Writable<State>;

  onMount(() => {
    console.log("mounted Camera.svelte", events, state);
  });
</script>

<h1>{$state.title}</h1>
<button on:click={() => events.emit("reset")}>Reset</button>
