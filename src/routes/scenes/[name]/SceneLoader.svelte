<script lang="ts">
  import type { Scene } from "$lib/core/scene.js";
  import { onMount } from "svelte";
  import type { ExampleScene } from "./+page.js";
  import { browser, building, dev, version } from "$app/environment";

  export let name: ExampleScene;

  let mounted: boolean = false;
  let loading: Promise<Scene>;

  async function load_scene() {
    console.log("loading scene", name);
    const module: { default: Scene } = await import(`$lib/scenes/${name}.ts`);
    console.log(module);
    return module.default;
  }

  onMount(() => {
    if (browser) {
      mounted = true;
      loading = load_scene();
    }
  });
</script>

{#if mounted}
  {#await loading}
    <p>loading...</p>
  {:then scene}
    <slot {scene} />
  {:catch ex}
    <slot name="error">
      <p class="error">Failed to load scene "{name}"</p>
    </slot>
  {/await}
{/if}
