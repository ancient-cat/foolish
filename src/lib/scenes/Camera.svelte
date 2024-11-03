<script lang="ts">
  import { createEventDispatcher, } from "svelte";
  const dispatch = createEventDispatcher();

  export let title: string;


</script>

<h1>{title}</h1>
<button on:click={() => dispatch("reset")}>Reset</button>
