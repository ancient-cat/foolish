import { Container, Rectangle, Ticker, type ContainerChild } from "pixi.js";
import { app, is_ready } from "./app.js";

export type Camera = ReturnType<typeof create_camera>;

export type CameraInitOptions = {
  centerOnStart: boolean;
};

export const create_camera = (options?: CameraInitOptions) => {
  let offset_x: number = 0;
  let offset_y: number = 0;
  let zoom_level = 1;
  let rotation_angle = 0;

  const node = new Container();

  const camera = {
    mount: () => {
      app.stage.addChild(node);

      return () => camera.dismount();
    },

    dismount: () => {
      app.stage.removeChild(node);
    },

    center: () => {
      offset_x = app.screen.width / 2;
      offset_y = app.screen.height / 2;
      node.position.set(offset_x, offset_y);
    },

    centerOn: (thing: ContainerChild) => {
      node.position.set(app.screen.width / 2 - thing.x * zoom_level, app.screen.height / 2 - thing.y * zoom_level);
    },

    follow: (thing: ContainerChild) => {
      // Update the camera position based on the target object's position
      camera.centerOn(thing);
      const f = (t: Ticker) => camera.centerOn(thing);
      app.ticker.add(f);
      return () => {
        app.ticker.remove(f);
      };
    },
    addChild: (...children: ContainerChild[]) => {
      node.addChild(...children);
    },
    removeChild: (...children: ContainerChild[]) => {
      node.addChild(...children);
    },
    move: (x: number, y: number) => {
      offset_x += x;
      offset_y += y;
      node.position.set(offset_x, offset_y);
    },
  };

  // is_ready will call when pixijs is initialized
  is_ready().then(() => {
    console.log(app.canvas.width, app.canvas.height);
    console.log(app.stage.x, app.stage.y);

    if (options?.centerOnStart ?? true) {
      camera.center();
    }
    // app.stage.addChild(ref);

    // app.stage.x = offset_x;
    // app.stage.y = offset_y;
  });

  return camera;
};
