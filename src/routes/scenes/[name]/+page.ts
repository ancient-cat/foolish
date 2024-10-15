import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types.js";

export type ExampleScene = "pixi-demo" | "test" | "camera";
const scenes: ExampleScene[] = ["pixi-demo", "test", "camera"];

const isSceneExample = (name: any): name is ExampleScene => scenes.includes(name);

export let load: PageLoad = ({ params }) => {
  let scene: ExampleScene;
  const scene_name: string = params.name.toLowerCase();

  if (isSceneExample(scene_name)) {
    scene = scene_name;
    return {
      scene,
    };
  } else {
    error(404, {
      message: "No Scene",
    });
  }
};
