import { Scenes } from "$lib/core/scene.js";
import { create_ui } from "$lib/ui/ui.js";
import * as UI from "./Bridge.svelte";

export default Scenes.create(async () => {
  const ui = create_ui<UI.Events, UI.State>(UI.default);

  return {
    name: "bridge_scene",
    enter: () => {
      return ui.mount();
    },
    update: (t) => {},
  };
});
