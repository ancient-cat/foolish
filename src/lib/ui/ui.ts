import { SvelteComponent, type ComponentEvents, type ComponentType, type ComponentProps } from "svelte";
import { create_event_dispatcher, type EventDispatcher } from "../core/dispatcher.js";
import { get, writable, type Writable } from "svelte/store";
import { assert } from "$lib/core/assert.js";

export const root_el = writable<HTMLElement | undefined>(undefined);

export const create_ui = <EventMap extends Record<string, any> = Record<string, any>, State = any>(
  Component: ComponentType,
  initial_state?: State,
) => {
  const events = create_event_dispatcher<EventMap>();
  const state = writable(initial_state);

  let component: SvelteComponent | undefined = undefined;

  const mount = () => {
    const target = get(root_el);
    assert(target !== undefined, "root element was not ready before ui.mount() was called");

    component = new Component({
      target,
      intro: true,
      props: {
        events,
        state,
      },
    });

    return () => {
      if (component !== undefined) {
        component.$destroy();
      }

      events.clear();
    };
  };

  return {
    mount,
    state,
    ...events,
  };
};
