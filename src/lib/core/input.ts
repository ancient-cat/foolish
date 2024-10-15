import type { Ticker } from "pixi.js";
import { assert } from "./assert.ts";
import { create_event_dispatcher } from "./dispatcher.ts";

type KeyboardEventMap = {
  keydown: KeyboardEvent;
  keyup: KeyboardEvent;
};

export const create_keyboard_listener = () => {
  const is_down = new Set<string>();
  const dispatcher = create_event_dispatcher<KeyboardEventMap>();

  const on_keydown = (e: KeyboardEvent) => {
    if (!e.repeat) {
      is_down.add(e.key);
      dispatcher.emit("keydown", e);
    }
  };

  const on_keyup = (e: KeyboardEvent) => {
    if (!e.repeat) {
      is_down.delete(e.key);
      dispatcher.emit("keyup", e);
    }
  };

  return {
    ...dispatcher,
    is_down: (key: string) => is_down.has(key),
    pressed_keys: () => Array.from(is_down.values()).sort(),
    subscribe: () => {
      window.addEventListener("keydown", on_keydown);
      window.addEventListener("keyup", on_keyup);

      return () => {
        window.removeEventListener("keydown", on_keydown);
        window.removeEventListener("keyup", on_keyup);
      };
    },
  };
};

export type MappedInput = ReturnType<typeof create_input_map>;

/**
 * Create a map of "commands" to their inputs
 * @param map 
 * @returns 
 * @example
 * ```ts
 * const input = create_input_map({
    attack: "space",
    open_menu: "return",
})l
 * ```
 */
export const create_input_map = <InputMap extends Record<string, string>>(map: InputMap) => {
  type Command = keyof InputMap;
  const command_state = new Set<Command>();
  const just_pressed = new Set<Command>();
  const command_lookup = new Map<string, Command>();

  for (let key in map) {
    const value = map[key];
    command_lookup.set(value, key);
    // if (Array.isArray(value)) {
    //     // chords:
    //     // key_state.set(value.join("+"), key);

    //     // many inputs
    //     for (let v in value) {
    //         key_state.set(v, key);
    //     }
    // }
    // else {
    //     key_state.set(value, key);
    // }
  }

  const keyboard = create_keyboard_listener();
  const dispatcher = create_event_dispatcher<InputMap>();

  const on_keydown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (command_lookup.has(key)) {
      const command = command_lookup.get(key);
      assert(command !== undefined);
      command_state.add(command);
      just_pressed.add(command);
      dispatcher.emit(command);
    }
  };
  const on_keyup = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (command_lookup.has(key)) {
      const command = command_lookup.get(key);
      assert(command !== undefined);
      command_state.delete(command);
      just_pressed.delete(command);
    }
  };

  // these will only fire once we've subscribed to keyboard
  keyboard.on("keydown", on_keydown);
  keyboard.on("keyup", on_keyup);

  return {
    keyboard,
    ...dispatcher,
    is_down: (cmd: Command) => {
      return command_state.has(cmd);
    },
    is_just_pressed: (cmd: Command) => {
      if (just_pressed.has(cmd)) {
        just_pressed.delete(cmd);
        return true;
      }

      return false;
    },
    update: (t: Ticker) => {},
    subscribe: () => {
      return keyboard.subscribe();
    },
  };
};
