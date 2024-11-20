<script lang="ts">
  interface Props {
    progress: number;
    max: number;
  }

  let { progress, max }: Props = $props();

  let percent = $derived(Math.trunc((progress / max) * 100));
  let ready = $derived(percent >= 100);
</script>

<div class="atb">
  <div class="progress" class:ready style={`--value: ${percent}%;`}>{percent}</div>
</div>

<style>
  .atb {
    border: 1px solid #000;
    height: 6px;
    margin-top: 2px;
    width: 100%;
  }

  .progress {
    width: min(100%, calc(var(--value, 0%)));
    background-color: #999;
    height: 100%;
    font-size: 0;
    transition: width 0.1s linear;
  }

  .ready {
    background-color: #6cc;
  }
</style>
