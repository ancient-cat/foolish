import { Application, Sprite, Assets, Container } from "pixi.js";

const PIXI_INIT_EVENT = "pixi_initialized" as const;

const is_ready_promise = new Promise<void>((r) => {
  if (typeof window !== "undefined") {
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
  }
});

export const app = new Application();

export const signal_as_ready = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PIXI_INIT_EVENT));
  }
};

export const is_ready = () => is_ready_promise;
