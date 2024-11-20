import type { BattleStats, create_battle_system } from "./index.ts";

export type Team = "player" | "enemy" | "environment";

export type BattleTargets = "enemy" | "ally" | "self" | "none" | "dead";

export type BattleAction = {
  id: BattleActionId;
  label: string;
  target: BattleTargets;
};

export const attackAction: BattleAction = {
  id: "attack",
  label: "Attack",
  target: "enemy",
};

export const killAction: BattleAction = {
  id: "kill",
  label: "kill",
  target: "enemy",
};

export const defendAction: BattleAction = {
  id: "defend",
  label: "Defend",
  target: "self",
};

export const healAction: BattleAction = {
  id: "heal",
  label: "Heal",
  target: "ally",
};

export const nothingAction: BattleAction = {
  id: "nothing",
  label: "do nothing",
  target: "none",
};

export type BattlePhase = "victory" | "defeat" | "active" | "preparing";
export type BattleState = {
  phase: BattlePhase;
  party: BattleActor[];
  foes: BattleActor[];
};

export type BattleQueueItem = {
  action: BattleAction;
  actor: BattleActor;
  target?: BattleActor;
};

export type InitBattleState = {
  party: BattleActor[];
  foes: BattleActor[];
};

export type BattleSystem = ReturnType<typeof create_battle_system>;

export type ActionSystem = unknown;

export type BattleActor = {
  can_act: boolean;
  id: unknown;
  name: string;
  team: Team;
  actions: BattleAction[];
  stats: BattleStats;
  buffs: Buff[];
  atb_speed: number;
  atb_value: number;
  atb_max: number;
  player_controlled: boolean;
};

export interface ActionStrategy {
  execute(actor: BattleActor, target: BattleActor | undefined): void;
}

export class AttackStrategy implements ActionStrategy {
  execute(actor: BattleActor, target: BattleActor | undefined): void {
    if (!target) throw new Error("Attack requires a target");
    if (target.buffs.includes("defend")) {
      target.stats.health -= actor.stats.damage * 0.5;
    } else {
      target.stats.health -= actor.stats.damage;
    }
  }
}

export class DefendStrategy implements ActionStrategy {
  execute(actor: BattleActor, target: BattleActor | undefined): void {
    actor.buffs.push("defend");
  }
}

export class HealStrategy implements ActionStrategy {
  execute(actor: BattleActor, target: BattleActor | undefined): void {
    if (!target) throw new Error("Heal requires a target");
    const base_heal = 4;
    target.stats.health += random(base_heal, base_heal * 2);
  }
}

export class KillStrategy implements ActionStrategy {
  execute(actor: BattleActor, target: BattleActor | undefined): void {
    if (!target) throw new Error("Kill requires a target");
    target.stats.health = 0;
  }
}

export class NothingStrategy implements ActionStrategy {
  execute(actor: BattleActor, target: BattleActor | undefined): void {
    // do nothing
  }
}

export const actionStrategies = {
  attack: new AttackStrategy(),
  defend: new DefendStrategy(),
  heal: new HealStrategy(),
  kill: new KillStrategy(),
  nothing: new NothingStrategy(),
} satisfies Record<string, ActionStrategy>;

export type BattleActionId = keyof typeof actionStrategies;
