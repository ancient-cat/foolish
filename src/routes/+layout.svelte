<svelte:head>
  <!-- the props -->
  <link rel="stylesheet" href="https://unpkg.com/open-props" />

  <!-- optional imports that use the props -->
  <link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/open-props/buttons.min.css" />

  <!-- individual imports -->
  <link rel="stylesheet" href="https://unpkg.com/open-props/indigo.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/open-props/indigo-hsl.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/open-props/easings.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/open-props/animations.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/open-props/sizes.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/open-props/gradients.min.css" />
  <!-- see PropPacks for the full list -->
</svelte:head>

<div class="container">
  <slot />
</div>
