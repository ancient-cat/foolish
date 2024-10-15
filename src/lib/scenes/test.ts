import { app } from "$lib/core/app.js";
import { create_input_map } from "$lib/core/input.js";
import { Scenes } from "$lib/core/scene.js";
import { Container, Application, Graphics } from "pixi.js";

export default Scenes.create(() => {
  const stage = new Container();
  let obj = new Graphics().rect(0, 0, 200, 100).fill(0xff0000);

  const input = create_input_map({
    move_left: "left",
    move_right: "right",
    move_up: "up",
    move_down: "down",
  });

  return {
    name: "test_id",

    enter: () => {
      app.stage.addChild(stage);
      stage.addChild(obj);
      const unsubscribe = input.subscribe();
      return unsubscribe;
    },

    exit: () => {
      app.stage.removeChild(stage);
    },

    update: function (t): void {},
  };
});
