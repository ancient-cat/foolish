import { Scenes } from "$lib/core/scene.js";
import { create_ui } from "$lib/ui/ui.js";

import Bridge from "./Bridge.svelte";

export default Scenes.create(async () => {
  const ui = create_ui(Bridge, {
    count: 10,
    title: "Hello from Scene",
    mouse: { x: 0, y: 0 },
  });

  ui.on("click", () => {
    console.log("UI click received in scene");
  });

  ui.on("mousemove", (event) => {
    ui.state.mouse = {
      x: event.detail.x,
      y: event.detail.y,
    };
  });

  return {
    name: "bridge_scene",
    enter: () => {
      return ui.mount();
    },
    update: (t) => {},
  };
});
