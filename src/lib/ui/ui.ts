import { SvelteComponent, type ComponentEvents, type ComponentType, type ComponentProps } from "svelte";
import { create_event_dispatcher, type EventDispatcher } from "../core/dispatcher.js";
import { get, writable, type Writable } from "svelte/store";
import { assert } from "$lib/core/assert.js";
import { create_signal } from "$lib/core/signal.js";

export const root_el = writable<HTMLElement | undefined>(undefined);

export const create_ui = <EventMap extends Record<string, any> = Record<string, any>, State = any>(
  Component: ComponentType,
  initial_state?: State,
) => {
  const events = create_event_dispatcher<EventMap>();
  const state = initial_state ?? {};

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
    get component() {
      return component;
    },
    set: (props: Partial<ComponentProps<NonNullable<typeof component>>>) => {
      if (component) {
        component.$set(props);
      }
    },
    mount,
    state,
    ...events,
  };
};

type UIBridge<
  UIComponent extends ComponentType,
  State = ComponentProps<InstanceType<UIComponent>>,
  Events extends Record<string, any> = ComponentEvents<InstanceType<UIComponent>>,
> = EventDispatcher<Events> & {
  mount: () => () => void;
  state: State;
};

export const create_ui2 = <
  UIComponent extends ComponentType,
  State = ComponentProps<InstanceType<UIComponent>>,
  Events extends Record<string, any> = ComponentEvents<InstanceType<UIComponent>>,
>(
  Component: UIComponent,
  initial_state?: State,
): UIBridge => {
  const events = create_event_connecter<Events>();
  const state = initial_state ?? {};

  let component: SvelteComponent | undefined = undefined;

  const mount = () => {
    const target = get(root_el);
    assert(target !== undefined, "root element was not ready before ui.mount() was called");

    component = new Component({
      target,
      intro: true,
      props: {
        ...state,
      },
    });

    const unsub = events.mount(component);

    return () => {
      unsub();
      if (component !== undefined) {
        component.$destroy();
      }

      events.clear();
    };
  };

  return {
    get component() {
      return component;
    },
    // set: (props: Partial<ComponentProps<NonNullable<typeof component>>>) => {
    //   if (component) {
    //     component.$set(props);
    //   }
    // },
    state,
    ...events,
    mount,
  };
};

type ComponentEventConnecter = {
  mount: <T extends ComponentType>(component: InstanceType<T>) => () => void;
};
export const create_event_connecter = <EventMap extends Record<string, any>>(): EventDispatcher<EventMap> & ComponentEventConnecter => {
  const events = new Map<keyof EventMap, CallableFunction[]>();
  const changed = create_signal<void>();

  const signal: EventDispatcher<EventMap> & ComponentEventConnecter = {
    on: (type, callback) => {
      const list = events.get(type) ?? [];
      list.push(callback);
      events.set(type, list);
      changed.emit();

      return () => signal.off(type, callback);
    },

    once: (type, callback) => {
      const unsub = signal.on(type, (detail: CustomEvent<EventMap[typeof type]>) => {
        unsub();
        callback(detail);
      });

      return unsub;
    },

    emit: (type, detail?: EventMap[typeof type]) => {
      const callbacks = events.get(type) ?? [];
      assert(typeof type === "string");

      const event = new CustomEvent(type, { detail });

      callbacks.forEach((cb) => {
        cb(event);
      });
    },

    off: (type, callback = undefined) => {
      if (callback === undefined) {
        events.set(type, []);
      } else {
        const list = events.get(type) ?? [];
        events.set(
          type,
          list.filter((cb) => cb !== callback),
        );
        changed.emit();
      }
    },
    clear: () => {
      events.clear();
      changed.emit();
    },

    mount: <T extends ComponentType>(component: InstanceType<T>) => {
      const listened_keys: Map<string, () => void> = new Map();
      const unlisten = changed.subscribe(() => {
        events
          .keys()
          .filter((key): key is string => typeof key === "string" && !listened_keys.has(key))
          .forEach((key) => {
            const unsub = component.$on(key, (e) => {
              signal.emit(key, e.detail);
            });
            listened_keys.set(key, unsub);
          });
      });

      return () => {
        listened_keys.values().forEach((unsub) => unsub());
        unlisten();
      };
    },
  };

  return signal;
};
