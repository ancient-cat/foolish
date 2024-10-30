<script lang="ts">
  import UserInterface from "./UserInterface.svelte";
  import PixiRenderer from "./PixiRenderer.svelte";

  import { createEventDispatcher } from "svelte";
  import { initialize } from "$lib/core/index.js";
  import { Scenes, type Scene } from "$lib/core/scene.js";

  let scene: Scene;

  const dispatch = createEventDispatcher();

  async function start(e: CustomEvent<HTMLElement>) {
    await initialize(e.detail);
    Scenes.init();
    dispatch("start");
  }
</script>

<UserInterface>
  <PixiRenderer on:ready={start} />
  <svelte:fragment slot="ui">
    <slot {scene} />
  </svelte:fragment>
</UserInterface>
