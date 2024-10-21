<script lang="ts">
  import { base } from "$app/paths";

  let scenes: string[] = ["pixi-demo", "test", "camera", "ui-test"];
</script>

<div class="page">
  <h3>Test Scenes</h3>
  <nav class="scene-list">
    <ul>
      {#each scenes as scene}
        <li>
          <a href={`${base}/scenes/${scene}`}>/scenes/{scene}</a>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .page {
    padding: 2.5vh 2.5vw;
  }
  .scene-list {
    padding: 1rem 1rem;
  }
</style>
