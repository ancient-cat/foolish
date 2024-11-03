import { SvelteComponent, type ComponentEvents, type ComponentType, type ComponentProps } from "svelte";
import { create_event_dispatcher, type EventDispatcher } from "../core/dispatcher.js";
import { get, writable, type Unsubscriber, type Writable } from "svelte/store";
import { assert } from "$lib/core/assert.js";
import { create_signal } from "$lib/core/signal.js";

export const root_el = writable<HTMLElement | undefined>(undefined);

type UIBridge<
  UIComponent extends ComponentType,
  State extends ComponentProps<InstanceType<UIComponent>> = ComponentProps<InstanceType<UIComponent>>,
  Events extends Record<string, any> = RemoveIndexSignature<ComponentEvents<InstanceType<UIComponent>>>,
> = ComponentEventForwarder<Events> & {
  mount: () => () => void;
  state: State;
};

type RemoveIndexSignature<T> = {
  [K in keyof T as K extends `${infer _}` ? K : never]: T[K];
};

export const create_ui = <
  UIComponent extends ComponentType,
  State extends ComponentProps<InstanceType<UIComponent>> = ComponentProps<InstanceType<UIComponent>>,
  Events extends Record<string, any> = RemoveIndexSignature<ComponentEvents<InstanceType<UIComponent>>>,
>(
  Component: UIComponent,
  initial_state: State,
): UIBridge<typeof Component> => {
  const events = create_event_connecter<Events>();
  const state: State = {... initial_state, };

  const stateProxy = new Proxy(state, {
    set(obj, prop, value) {
      if (component) {
        component.$set({
          [prop]: value,
        });
      }
      
      return Reflect.set(obj, prop, value);
    },
  })

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
    state: stateProxy,

    ...events,
    mount,
  };
};



export interface ComponentEventForwarder<EventMap extends Record<string, any> = Record<string, any>> {
  on: <EventName extends keyof EventMap>(type: EventName, callback: (event: EventMap[EventName]) => unknown) => Unsubscriber;
  once: <EventName extends keyof EventMap>(type: EventName, callback: (event: EventMap[EventName]) => unknown) => Unsubscriber;
  off: <EventName extends keyof EventMap>(type: EventName, callback?: (event: EventMap[EventName]) => unknown) => void;
  emit: <EventName extends keyof EventMap>(event: EventName, detail?: EventMap[EventName]) => void;
  clear: () => void;
  mount: <T extends ComponentType>(component: InstanceType<T>) => () => void;
};

export const create_event_connecter = <EventMap extends Record<string, any>>(): ComponentEventForwarder<EventMap> => {
  const events = new Map<keyof EventMap, CallableFunction[]>();
  const changed = create_signal<void>();

  const signal: ComponentEventForwarder<EventMap> = {
    on: (type, callback) => {
      const list = events.get(type) ?? [];
      list.push(callback);
      events.set(type, list);
      changed.emit();

      return () => signal.off(type, callback);
    },

    once: (type, callback) => {
      const unsubscribe = signal.on(type, (detail: EventMap[typeof type]) => {
        unsubscribe();
        callback(detail);
      });

      return unsubscribe;
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

      const addListeners = () => {
        events
          .keys()
          .filter((key): key is string => typeof key === "string" && !listened_keys.has(key))
          .forEach((key) => {
            console.log(Array.from(listened_keys))
            const unsub = component.$on(key, (e) => {
              signal.emit(key, e.detail);
            });
            listened_keys.set(key, unsub);
          });
      }

      addListeners();
      const unlisten = changed.subscribe(addListeners);

      return () => {
        listened_keys.values().forEach((unsub) => unsub());
        unlisten();
      };
    },
  };

  return signal;
};
