<script lang="ts">
  import { app, initialize } from "$lib/core/index.ts";
  import { Scenes, type Scene } from "$lib/core/scene.ts";
  import { Assets, Container, Sprite } from "pixi.js";
  import { onMount } from "svelte";

  export let scene: Scene;

  async function start() {
    await initialize(document.body);
    await Scenes.switch(scene);
  }

  onMount(() => {
    console.log(app);
    start();
  });
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    scroll-snap-type: none;
  }
</style>
