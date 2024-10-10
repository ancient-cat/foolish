import type { Readable } from "./observable/store-types.ts";
import { tap, untap } from "./observable/stores.ts";


type MaybePromise = Promise<void> | void;
export type Scene<T = undefined> = {
  name: string;
  state: T;
  stores?: Readable<any>[];
  update: (dt: number) => void;
  init?: () => MaybePromise;
  draw: () => void;
  enter?: (from?: Scene) => MaybePromise;
  exit?: () => MaybePromise;
};

type SceneMode = {
  update: boolean;
  draw: boolean;
  handlers: boolean;
};

export type SceneManager = {
  init: () => void;
  current: () => Scene<any> | undefined;
  get_scenes: () => readonly Scene<any>[];
  create: <T>(scene_init: () => Scene<T>) => Scene<T>;
  switch: (scene: Scene<any>) => Promise<Scene<any>>;
  push: (scene: Scene<any>, mode?: Partial<SceneMode>) => MaybePromise;
  pop: () => MaybePromise;

  update: (dt: number) => void;
  draw: () => void;

};

const default_scene_mode: SceneMode = {
  update: true,
  draw: true,
  handlers: true,
};

let scenes: Scene<any>[] = [];
const modes: SceneMode[] = [];
export const initialized_scenes = new Set<Scene<any>["name"]>();

export const get_modes = () => [default_scene_mode, ...modes];
export const get_scenes = () => {
  return {
    drawn_scenes,
    updated_scenes,
    handler_scenes,
  };
};

let drawn_scenes: Scene<any>[] = [];
let updated_scenes: Scene<any>[] = [];
let handler_scenes: Scene<any>[] = [];

const recompute_scenes = () => {
  let last_drawn_index = modes.findIndex((t) => t.draw === false);
  let last_updated_index = modes.findIndex((t) => t.update === false);
  let last_handler_index = modes.findIndex((t) => t.handlers === false);

  // the "top" scene is always drawn, handled, and updated,
  // AND modes is always one less than scenes to accomodate
  const offset = 1;

  if (last_drawn_index === -1) {
    drawn_scenes = scenes.toReversed();
  } else {
    drawn_scenes = scenes.slice(0, last_drawn_index + offset).reverse();
  }

  if (last_updated_index === -1) {
    updated_scenes = scenes.toReversed();
  } else {
    updated_scenes = scenes.slice(0, last_updated_index + offset).reverse();
  }

  if (last_handler_index === -1) {
    handler_scenes = scenes.toReversed();
  } else {
    handler_scenes = scenes.slice(0, last_handler_index + offset).reverse();
  }
};

const enter_scene = async (scene: Scene) => {
  if (scene.enter !== undefined) {
    await scene.enter();
  }

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

  create: <T>(scene_init: () => Scene<T>) => {
    const scene: Scene<T> = scene_init();
    return scene;
  },

  switch: async (scene) => {
    const previous = Scenes.current();
    if (previous != undefined) {
      await exit_scene(previous);
    }

    if (scenes.length > 0) {
      scenes.shift();
    }

    scenes.unshift(scene);

    recompute_scenes();

    if (scene.init !== undefined) {
      if (!initialized_scenes.has(scene.name)) {
        initialized_scenes.add(scene.name);
        await scene.init();
      }
    }

    await enter_scene(scene);

    return scene;
  },

  push: async (scene, mode) => {
    const current = Scenes.current();

    if (mode === undefined) {
      modes.unshift(default_scene_mode);
    } else {
      modes.unshift({ ...default_scene_mode, ...mode });
    }

    scenes.unshift(scene);

    recompute_scenes();

    await enter_scene(scene);
  },

  pop: async () => {
    const current = Scenes.current();

    scenes.shift();
    modes.shift();

    recompute_scenes();

    if (current !== undefined) {
      exit_scene(current);
    }
  },

  update: (dt) => {
    updated_scenes.forEach((scene) => scene.update(dt));
  },

  draw: () => {
    drawn_scenes.forEach((scene) => scene.draw());
  },
};
