<script lang="ts">
  import type { ExampleScene } from "./scenes/[name]/proxy+page.ts";

  let scenes: ExampleScene[] = ["pixi-demo", "test", "camera"];
</script>

<div class="page">
  <h3>Test Scenes</h3>
  <nav class="scene-list">
    <ul>
      {#each scenes as scene}
        <li>
          <a href={`/scenes/${scene}`}>/scenes/{scene}</a>
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
