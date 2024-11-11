import type { LayoutLoad } from "./$types.js";
import { base } from "$app/paths";

export const load: LayoutLoad = async (event) => {
  const response = await event.fetch(`${base}/package`, { method: "GET" });
  const json = await response.json();
  return {
    package: json,
  };
};
