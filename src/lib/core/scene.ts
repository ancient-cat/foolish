import type { Readable } from "./observable/store-types.js";
import { create_writable, tap, untap } from "./observable/stores.js";
import type { Application, Container, Ticker } from "pixi.js";
import { app, is_ready } from "./app.js";
import type { Unsubscriber } from "svelte/store";
import { assert } from "./assert.js";

export const current_scene = create_writable<Scene | undefined>(undefined);

const scene_context: Map<string, Unsubscriber[]> = new Map();

type MaybePromise = Promise<void> | void;
type MaybeUnsubscriber = (() => Promise<() => void>) | (() => void);

/**
 * A Scene, or a Scene that will be loaded once the application is ready
 */
type LoadedScene = Promise<Scene>;
/**
 * This is either a promise that returns to a scene, or a scene itself;
 */
type SceneInitializer = () => LoadedScene;

export const use = (...unsubs: Unsubscriber[]) => {
  const scene = current_scene.get();
  assert(scene !== undefined);
  const list = scene_context.get(scene.name) ?? [];
  list.push(...unsubs);
  scene_context.set(scene.name, list);
};

export type Scene = {
  name: string;
  update: (t: Ticker) => void;
  init?: () => MaybePromise;
  enter?: (from?: Scene) => MaybeUnsubscriber | MaybePromise | Promise<MaybeUnsubscriber>;
  exit?: () => MaybePromise;
};

export type SceneManager = {
  init: () => Promise<void>;
  on_ready: Promise<void>;
  current: () => Scene | undefined;
  get_scenes: () => readonly Scene[];
  create: (scene_init: SceneInitializer) => LoadedScene;
  switch: (scene: LoadedScene | Scene) => LoadedScene;
  push: (scene: LoadedScene | Scene) => MaybePromise;
  pop: () => MaybePromise;
  pause: (scene: LoadedScene | Scene) => void;
  resume: (scene: LoadedScene | Scene) => void;
};

const scenes: Scene[] = [];

export const initialized_scenes = new Set<Scene["name"]>();
const running_scenes: Set<string> = new Set();
type Dismounter = ReturnType<Awaited<NonNullable<Scene["enter"]>>>;
const scene_dismounts = new Map<string, Dismounter>();

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
};

const exit_scene = async (scene: Scene) => {
  Scenes.pause(scene);

  if (scene_context.has(scene.name)) {
    const unsubs = scene_context.get(scene.name);
    unsubs?.forEach((u) => u());
  }

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

const { promise, resolve } = Promise.withResolvers<void>();

export const Scenes: SceneManager = {
  init: async () => {
    console.log("Initializing Scenes");
    initialized_scenes.clear();
    resolve();
  },

  on_ready: promise,

  current: () => scenes.at(0) ?? undefined,

  get_scenes: () => scenes,

  create: async (scene_init) => {
    await promise;
    const scene: Scene = await scene_init();
    console.log("Created scene:", scene.name);
    return scene;
  },

  switch: async (scene_capability) => {
    const scene = await scene_capability;
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

  push: async (scene_capability) => {
    const scene = await scene_capability;
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

  pause: async (scene_capability) => {
    const scene = await scene_capability;
    if (running_scenes.has(scene.name)) {
      app.ticker.remove(scene.update);
      running_scenes.delete(scene.name);
    }
  },

  resume: async (scene_capability) => {
    const scene = await scene_capability;
    running_scenes.add(scene.name);
    app.ticker.add(scene.update);
  },
};
