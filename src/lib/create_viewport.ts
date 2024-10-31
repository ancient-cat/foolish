import type { Application, FindMixin } from "pixi.js";
import { Viewport, type IViewportOptions } from "./core/viewport/Viewport.js";
import { noop } from "./core/utils.js";
import type { IDragOptions } from "./core/viewport/index.js";

// export type ViewportWithMount = Viewport & {
//   mount: () => () => void;
//   //   move: (x: number, y: number) => void;
// };

class ViewportWithMount extends Viewport {
  constructor(
    private app: Application,
    options: IViewportOptions,
  ) {
    super(options);
    console.log(this);
  }

  mount() {
    this.app.stage.addChild(this);
    return () => {
      this.app.stage.removeChild(this);
    };
  }
}

type CameraConfigurer = (viewport: Viewport) => void;

/**
 * See https://davidfig.github.io/pixi-viewport/
 * @param app
 * @param options
 * @param configure Functions that are called with the pixi-viewport instance.
 * @returns
 */
export const create_viewport = (
  app: Application,
  options: Partial<IViewportOptions> & Partial<FindMixin> = {},
  ...configurers: CameraConfigurer[]
) => {
  const vp = new ViewportWithMount(app, {
    events: app.renderer.events,
    screenWidth: app.canvas.width,
    screenHeight: app.canvas.height,
    passiveWheel: false,
    ticker: app.ticker,
    disableOnContextMenu: true,
    ...options,
  });

  configurers.forEach((c) => c(vp));
  return vp;
};

export const as_draggable = (options?: IDragOptions) => (viewport: Viewport) => {
  viewport.drag({
    direction: "all",
    mouseButtons: "all",
    ...options,
  });

  viewport.options.disableOnContextMenu = true;
};
