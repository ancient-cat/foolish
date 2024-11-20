<script lang="ts">
  import type { BattleActor } from "./index.ts";

  interface Props {
    character: BattleActor;
    selectable?: boolean;
    current?: boolean;
    onSelect: (character: BattleActor) => void;
  }
  import ActionBar from "./ActionBar.svelte";

  let { character, selectable = false, current = false, onSelect }: Props = $props();

  let damaged: boolean = false;

  let can_target = $derived(selectable && !character.stats.dead);

  function onPick(e: MouseEvent) {
    if (can_target) {
      onSelect(character);
    }
  }
</script>

<button class:damaged onclick={onPick} class="character" class:current class:selectable={can_target} class:dead={character.stats.dead}>
  <div class="img">{character.id}</div>
  <div class="name">{character.name}</div>
  <div class="stats">
    {#if character.stats.dead}
      <span class="dead">dead</span>
    {:else}
      <span class="hp" title="Health">
        {character.stats.health}
      </span>
    {/if}
  </div>

  <ActionBar progress={character.atb_value} max={character.atb_max} />
</button>

<style>
  .name {
    font-weight: 600;
  }

  .hp {
    font-size: 1.5em;
  }
  .character {
    padding: 0.5em 0.5em;
    appearance: none;
    background: transparent;
    border: 1px solid transparent;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 8rem;
    gap: 0.75rem;
    border-bottom: 1px solid #000;
    align-items: center;
    width: 100%;
  }

  .current {
    backdrop-filter: invert(0.8) saturate(1.1) brightness(1.3);
    outline: 2px solid #000;
    border-radius: 3px;
    border-bottom: 1px solid transparent;
  }

  .img {
    aspect-ratio: 1 / 1;
    border: 1px solid #000;
    width: 1.5rem;
    display: grid;
    place-content: center;
    object-fit: fill;
    text-transform: lowercase;
  }

  .stats {
    margin-left: auto;
  }

  .selectable {
    background: #9cc;
    cursor: pointer;
  }
  .dead .stats {
    color: #f54;
  }

  .damaged {
    animation: damaged 0.4s ease-in-out;
  }
  @keyframes damaged {
    0%,
    100% {
      transform: none;
      color: inherit;
    }
    10%,
    30%,
    50%,
    70% {
      transform: translateX(5px);
      color: #511;
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(-5px);
      color: #511;
    }
  }
</style>
