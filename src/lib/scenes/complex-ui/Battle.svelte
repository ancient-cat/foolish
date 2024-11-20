<script lang="ts">
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { crossfade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import CharacterPanel from "./CharacterPanel.svelte";
  import type { BattleQueueItem, BattleState, BattleTargets, BattleActor, BattleAction, BattleSystem } from "./index.ts";

  interface Props {
    // battle_system: BattleSystem["props"];
    battle: BattleState;
    // queue: BattleQueueItem[];
    // party: BattleState["party"];
    // foes: BattleState["foes"];
    // phase: BattleState["phase"];
    onAction: (item: BattleQueueItem) => void;
    onTogglePause: () => void;
  }

  let { battle, onAction, onTogglePause }: Props = $props();

  let paused: boolean = $state(false);

  let select_target: BattleTargets | undefined = $state(undefined);

  let target_selected: Promise<BattleActor> | undefined = undefined;
  let pick_target: ((value: BattleActor) => void) | undefined = $state(undefined);
  let cancelTargeting: ((reason?: any) => void) | undefined = $state(undefined);

  let members_who_can_act = $derived(battle.party.filter((member) => member.can_act));

  async function performAction(actor: BattleActor, action: BattleAction) {
    console.log(`${actor.name} performs ${action.label}`);

    if (action.target === "enemy" || action.target === "ally") {
      const fence = Promise.withResolvers<BattleActor>();

      [target_selected, pick_target, cancelTargeting] = [fence.promise, fence.resolve, fence.reject];

      select_target = action.target;
      try {
        const target = await fence.promise;

        onAction({
          action,
          actor,
          target,
        });
      } catch (ex) {
        //
      } finally {
        select_target = undefined;
        pick_target = undefined;
        cancelTargeting = undefined;
      }
    } else {
      onAction({
        action,
        actor,
        target: undefined,
      });
    }
  }

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 200,
        easing: quintOut,
        css: (t) => `
          transform: ${transform} scale(${Math.max(0.5, t)}) translate(${20 * (1 - t)}rem, ${10 * (1 - t)}rem);
          opacity: ${t}
        `,
      };
    },
  });

  onMount(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        cancelTargeting?.();
        onTogglePause();
        paused = !paused;
      }
    });
  });
</script>

{#if battle.phase === "preparing"}
  <p>Preparing Battle...</p>
{:else}
  {#if paused}
    <div class="message geo-font pause" transition:fly={{ y: 200, duration: 200 }}>
      <h1 style="text-transform: uppercase">Paused</h1>
    </div>
  {/if}
  {#if battle.phase === "victory" || battle.phase === "defeat"}
    <div class="message geo-font blur-backdrop" in:fly={{ y: 200, duration: 500 }}>
      <h1 style="text-transform: uppercase">{battle.phase}!</h1>
      {#if battle.phase === "victory"}
        <p>Creating a new battle...</p>
      {/if}
    </div>
  {/if}
  <div class="battle geo-font" class:battle-disabled={battle.phase !== "active" || paused}>
    <div class="queue-panel">
      <legend>Queue</legend>
      <div class="queue">
        {#each battle.queue as item (item.actor.id)}
          <div
            class="queue-item"
            class:ally={item.actor.team === "player"}
            in:receive={{ key: item.actor.id }}
            out:send={{ key: item.actor.id }}
            animate:flip
          >
            {item.actor.name} will {item.action.label}
            {item.target?.name ?? ""}
          </div>
        {/each}
      </div>
    </div>

    <div class="status">
      <div class="team-panel characters">
        {#each battle.party as character}
          <CharacterPanel {character} current={false} selectable={select_target === "ally"} onSelect={() => pick_target?.(character)} />
        {/each}
        <div class="panel-label jusitify-content-end">Party</div>
      </div>

      <div class="team-panel characters">
        {#each battle.foes as character}
          <CharacterPanel {character} current={false} selectable={select_target === "enemy"} onSelect={() => pick_target?.(character)} />
        {/each}
        <div class="panel-label jusitify-content-start">Enemy</div>
      </div>
    </div>

    <div class="bottom-panel">
      <legend>Available Actions</legend>
      <div class="team-actions">
        {#each members_who_can_act as member, i (member.id)}
          <div class="actions-panel" in:receive={{ key: member.id }} out:send={{ key: member.id }} animate:flip>
            <legend>{member.name} Actions</legend>
            <div class="actions">
              <fieldset disabled={select_target !== undefined}>
                {#each member.actions as actionitem}
                  <button class="action roboto-mono" onclick={() => performAction(member, actionitem)}>{actionitem.label}</button>
                {/each}
              </fieldset>
              {#if select_target !== undefined}
                <button onclick={cancelTargeting}>Cancel</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  fieldset {
    outline: none;
    border: none;
    display: contents;
  }

  fieldset[disabled] button {
    background: #444;
    color: #666;
  }

  .battle {
    height: 100vh;
    width: calc(100vw - 2rem);
    display: flex;
    flex-direction: column;
  }
  .status {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .team-panel {
    border: 1px solid #000;
  }

  .team-actions {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }

  .actions-panel {
    padding: 1rem 1rem;
    border: 1px solid #000;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  legend {
    margin-bottom: 1rem;
  }

  .action {
    padding: 0.5em 1em;
    display: block;
    appearance: none;
    border: none;
    border-radius: 6px;
  }

  button {
    display: block;
    background-color: #111;
    color: #fff;
    cursor: pointer;
    padding: 0.5em 1em;
  }

  .team-panel {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .bottom-panel {
    border: 1px solid #000;
    padding: 1rem;
    margin-top: 5vh;
  }

  .panel-label {
    background-color: #000;
    color: #c5c5c5;
    padding: 0.5em;
    margin-top: auto;
  }

  .jusitify-content-end {
    display: flex;
    justify-content: end;
  }
  .jusitify-content-start {
    display: flex;
    justify-content: start;
  }

  .queue-panel {
    padding: 1rem;
    border: 1px solid #000;
    margin-bottom: 5vh;
  }

  .queue {
    display: flex;
    gap: 1rem;
    font-size: 1rem;
    min-height: 4rem;
    align-items: start;
  }

  .queue-item {
    padding: 0.5rem;
    background-color: #3f2222;
    color: #c5c5c5;
  }

  .queue-item.ally {
    background-color: #222f45;
  }

  .battle-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .message {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-content: center;
    font-size: 2.5em;
  }

  .pause {
    bottom: 75%;
    color: #fff;
  }

  .blur-backdrop {
    backdrop-filter: blur(2px) grayscale(1);
  }
</style>
