<script lang="ts">
  interface Props {
    title: string;
    onReset: () => void;
  }

  let { title, onReset }: Props = $props();
</script>

<h1>{title}</h1>
<button onclick={onReset}>Reset</button>
