import { app } from "$lib/core/app.js";
import { Scenes, type Scene } from "$lib/core/scene.js";
import { Container, Application } from "pixi.js";

export default Scenes.create(async () => {
  const stage = new Container({
    label: "",
  });

  return {
    name: "scene_1",

    update: function (t): void {},
  };
});
