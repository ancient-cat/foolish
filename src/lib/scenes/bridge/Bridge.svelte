<script lang="ts">
  interface Props {
    title: string;
    mouse: { x: number; y: number };
    count?: number;
    onClick?: (click: number) => void;
    onMouseMove?: (mouse: { x: number; y: number }) => void;
  }

  let { title, mouse, count = $bindable(0), onClick, onMouseMove }: Props = $props();

  function _onClick() {
    onClick?.(count);
  }

  function _onMouseMove(e: MouseEvent) {
    onMouseMove?.({ x: e.x, y: e.y });
  }
</script>

<svelte:window onmousemove={_onMouseMove} />

<h1>{title}</h1>

<button onclick={() => (count -= 1)}>-</button>
<button onclick={_onClick}>{count}</button>
<button onclick={() => (count += 1)}>+</button>
<pre style="margin: 1rem;">{JSON.stringify(mouse)}</pre>
