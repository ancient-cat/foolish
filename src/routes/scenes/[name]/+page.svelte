<script lang="ts">
  import type { Scene } from "$lib/core/scene.js";
  import Renderer from "../../Renderer.svelte";
  import type { PageData } from "./$types.js";
  import SceneLoader from "./SceneLoader.svelte";

  export let data: PageData;
</script>

<SceneLoader name={data.scene} let:scene>
  <Renderer {scene} />
</SceneLoader>
