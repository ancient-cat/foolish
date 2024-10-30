import { penner as Penner } from "./external/penner.js";

/**
 * Returns correct Penner equation using string or Function.
 *
 * @internal
 * @ignore
 * @param {(function|string)} [ease]
 * @param {defaults} default penner equation to use if none is provided
 */

type PennerLib = Record<string, any>;

export default function ease(ease: any, defaults?: any): any {
  if (!ease) {
    return (Penner as PennerLib)[defaults];
  } else if (typeof ease === "function") {
    return ease;
  } else if (typeof ease === "string") {
    return (Penner as PennerLib)[ease];
  }
}
