<script lang="ts">
  import Game from "$lib/ui/Game.svelte";
  import test from "$lib/scenes/test.js";
  import { Scenes } from "$lib/index.js";

  async function initialize() {
    Scenes.switch(test);
  }
</script>

<Game onStart={initialize} />
