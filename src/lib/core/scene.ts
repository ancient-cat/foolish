import type { Readable } from "./observable/store-types.js";
import { create_writable, tap, untap } from "./observable/stores.js";
import type { Application, Container, Ticker } from "pixi.js";
import { app } from "./app.js";

export const current_scene = create_writable<Scene | undefined>(undefined);

type MaybePromise = Promise<void> | void;
type MaybeUnsubscriber = (() => Promise<() => void>) | (() => void);

export type Scene = {
  name: string;
  stores?: Readable<any>[];
  update: (t: Ticker) => void;
  init?: () => MaybePromise;
  enter?: (from?: Scene) => MaybeUnsubscriber | MaybePromise | Promise<MaybeUnsubscriber>;
  exit?: () => MaybePromise;
};

export type SceneManager = {
  init: () => void;
  current: () => Scene | undefined;
  get_scenes: () => readonly Scene[];
  create: (scene_init: () => Scene) => Scene;
  switch: (scene: Scene) => Promise<Scene>;
  push: (scene: Scene) => MaybePromise;
  pop: () => MaybePromise;
  pause: (scene: Scene) => void;
  resume: (scene: Scene) => void;
};

let scenes: Scene[] = [];

export const initialized_scenes = new Set<Scene["name"]>();
const running_scenes: Set<string> = new Set();
type Dismounter = ReturnType<Awaited<NonNullable<Scene["enter"]>>>;
let scene_dismounts = new Map<string, Dismounter>();

const enter_scene = async (scene: Scene) => {
  if (scene.enter !== undefined) {
    const dismount = await scene.enter();
    if (dismount !== undefined) {
      if (scene_dismounts.has(scene.name)) {
        console.error(`Adding dismounts for a scene already mounted: "${scene.name}". You should give these scenes unique names`);
      }
      scene_dismounts.set(scene.name, dismount);
    }
  }

  Scenes.resume(scene);

  // CASE: tap stores after so we can set stores without effects inside of scene.enter
  if (scene.stores !== undefined) {
    console.log(`Scene has ${scene.stores.length} stores. Tapping...`);
    tap(...scene.stores);
  }
};

const exit_scene = async (scene: Scene) => {
  if (scene.stores !== undefined) {
    untap(...scene.stores);
  }

  Scenes.pause(scene);

  if (scene_dismounts.has(scene.name)) {
    const dismounter = scene_dismounts.get(scene.name);
    if (typeof dismounter === "function") {
      await dismounter();
    }
  }

  if (scene.exit !== undefined) {
    await scene.exit();
  }
};

export const Scenes: SceneManager = {
  init: () => {
    initialized_scenes.clear();
  },
  current: () => scenes.at(0) ?? undefined,

  get_scenes: () => scenes,

  create: (scene_init: () => Scene) => {
    const scene: Scene = scene_init();
    return scene;
  },

  switch: async (scene) => {
    const previous = Scenes.current();
    if (previous != undefined) {
      await exit_scene(previous);
    }

    if (scenes.length > 0) {
      scenes.pop();
    }

    scenes.push(scene);

    if (scene.init !== undefined) {
      if (!initialized_scenes.has(scene.name)) {
        initialized_scenes.add(scene.name);
        await scene.init();
      }
    }

    await enter_scene(scene);

    return scene;
  },

  push: async (scene) => {
    const current = Scenes.current();
    scenes.push(scene);
    await enter_scene(scene);
  },

  pop: async () => {
    const current = Scenes.current();

    scenes.pop();

    if (current !== undefined) {
      await exit_scene(current);
    }
  },

  pause: (scene) => {
    if (running_scenes.has(scene.name)) {
      app.ticker.remove(scene.update);
      running_scenes.delete(scene.name);
    }
  },

  resume: (scene) => {
    running_scenes.add(scene.name);
    app.ticker.add(scene.update);
  },
};
