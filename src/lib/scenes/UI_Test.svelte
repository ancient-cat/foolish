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
  import { createEventDispatcher,} from "svelte";

  const dispatch = createEventDispatcher();

  export let title: string;
  export let count: number = 0;

  $: dispatch("count", count)

  function add() {
    count += 1;
    dispatch("add", count);
  }

  function subtract() {
    count -= 1;
    dispatch("subtract", count);
  }

  function reset() {
    dispatch("reset");
  }
</script>

<h1>{title}</h1>

<button on:click={reset}>Reset</button>

<button on:click={subtract}> - </button>
{count}
<button on:click={add}> + </button>
