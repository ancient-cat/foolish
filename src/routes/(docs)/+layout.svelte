<script lang="ts">
    import { base } from "$app/paths";
    import { getStores, navigating, page, updated } from '$app/stores';


    $: pagePath = $page.url.pathname

    
    let links: [label: string, link: string, ][] = [
      ["about", "/"],
    ];

    let documentation: string[] = [
      "getting-started",
      "ui"
    ];

    let scenes: string[] = ["pixi-demo", "test", "camera", "ui-test", "ui-bridge"];
</script>

<div class="container content">
  <header class="sidebar subtitle">
    <svelte:element this={pagePath === "/" ? "h1" : "h2"} class="title">Foolish</svelte:element>
    <nav class="list">
      {#each links as [label, link]}
        <a  class="link" class:active={link === pagePath} href={`${base}${link}`}>{label}</a>
      {/each}

      <h5 class="sep subtitle">Docs</h5>
      {#each documentation as doc}
      {@const link = `/docs/${doc}`}
        <a class="link" class:active={link === pagePath} href={`${base}${link}`}>{doc}</a>
      {/each}

      <h5 class="sep subtitle">Scenes</h5>
      {#each scenes as scene}
        {@const link = `/scenes/${scene}`}
        <a  class="link" class:active={link === pagePath} href={`${base}${link}`}>{scene}</a>
      {/each}
    </nav>
  </header>
  <main class="page">
    <slot />
  </main>
</div>



<style>
  .sidebar {
    margin: 0 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 2rem 2rem;
  }
  .list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
  }
  .content {
      padding: 2rem 2rem;
      display: grid;
  }

  @media screen and (min-width: 64rem) {
    .content {
      padding: 2rem 2rem;
      display: grid;
      grid-template-columns: 14rem auto;
      gap: 2.5vw;
      height: 100vh;
  }
  }



  .page {
    margin-top: 2rem;
  }

  :global(.page :where(h2, h3, h4, h5)) {
    margin: 2rem 0 1rem 0;
  }

  .sep {
    margin-top: 1rem;
  }

  
  .title {
    font-size: 1.5em;
    margin-bottom: 1rem;
  }

  .link {
    display: flex;
    padding: 0.25em 0.5em;
    text-decoration: none;
    background-color: hsla(0, 0, 100, 0);
    border-radius: 9px;
    gap: 0.5rem;
  }
  .link:hover {
    background-color: hsla(0deg, 0%, 0%, 0.1);
  }

  .link:before {
    content: "⋱";
    display: inline-block;
    color: #444;
  }

  .active {
      color: #fff;
      background-color: hsla(0deg, 0%, 0%, 0.2);
  }

  .active:before {
    content: "⋊";
    color: #444;
    
    text-decoration: none;
  }

</style>