import type { BattleActor } from "./actors.js";
import type { BattleQueueItem, BattleState, BattleSystem } from "./index.ts";
import { pick_option } from "./random.ts";

export const create_ai = (state: BattleState, enqueue: BattleSystem["enqueue"]) => {
  const action_state = new Set<BattleActor>();
  const is_handled = (actor: BattleActor) => action_state.has(actor);

  const perform_action = async (actor: BattleActor) => {
    const action = pick_option(actor.actions);

    action_state.add(actor);

    if (action) {
      let foes: BattleActor[];
      let party: BattleActor[];
      if (actor.team === "enemy") {
        foes = state.party;
        party = state.foes;
      } else if (actor.team === "player") {
        foes = state.foes;
        party = state.party;
      } else {
        throw new Error(`AI not implemented for team: ${actor.team}`);
      }

      let target: BattleActor | undefined = undefined;
      if (action.target === "enemy") {
        target = pick_option(foes);
      } else if (action.target === "ally") {
        target = pick_option(party);
      } else if (action.target === "self") {
        target = actor;
      }

      const battle_queue_item: BattleQueueItem = { actor, action, target };
      await enqueue(battle_queue_item);

      action_state.delete(actor);
    }
  };

  return {
    is_handled,
    perform_action,
  };
};
