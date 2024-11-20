<script lang="ts">
  import { run } from "svelte/legacy";

  interface Props {
    title: string;
    count?: number;
    onCount?: (count: number) => void;
    onAdd?: (count: number) => void;
    onSubtract?: (count: number) => void;
    onReset?: () => void;
  }

  let { title, count = $bindable(0), onCount, onAdd, onSubtract, onReset }: Props = $props();

  run(() => {
    onCount?.(count);
  });

  function add() {
    count += 1;
    onAdd?.(count);
  }

  function subtract() {
    count -= 1;
    onSubtract?.(count);
  }

  function reset() {
    onReset?.();
  }
</script>

<h1>{title}</h1>

<button onclick={reset}>Reset</button>

<button onclick={subtract}> - </button>
{count}
<button onclick={add}> + </button>
