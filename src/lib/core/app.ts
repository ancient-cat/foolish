import { Application, Sprite, Assets, Container } from "pixi.js";

const PIXI_INIT_EVENT = "pixi_initialized" as const;

const is_ready_promise = new Promise<void>((r) => {
  window.addEventListener(
    PIXI_INIT_EVENT,
    () => {
      console.log("Pixi was initialized");
      r();
    },
    {
      once: true,
    },
  );
});

export const app = new Application();
console.log("APP", app);

export const signal_as_ready = () => {
  window.dispatchEvent(new CustomEvent(PIXI_INIT_EVENT));
};

export const is_ready = () => is_ready_promise;
