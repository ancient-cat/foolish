# UI

## About

UI is just a svelte component. <br />

It is mounted and controlled via scenes. <br/><br/>

<small style="display: block; width: 100%; color: #666">
In theory you could have many UIs per scene, but likely simplest to keep it 1 to 1.
</small>

## Creating a UI Svelte Component

In _Hello World_ fashion:

```svelte
<!-- HelloWorld.svelte -->
<script lang="ts">
  export let name: string;
</script>

<h1>Hello {name}</h1>
```

## Creating a UI bridge

The bridge will handle rendering on-top-of the Game screen area when mounted.
<br />
Additionally, it will forward events from the component to your scene, and forward changes to state to the rendered component.
<br />
This example builds upon the _Getting Started_ example.
<br/><br/>

Examine the following changes, which add a ui bridge to a scene:

```diff
// my_scene.ts
- import { Scenes, app } from "squander";
+ import { Scenes, app, create_ui } from "squander";
+ import HelloWorld from "./HelloWorld.svelte";

export default Scenes.create(async () => {

     // this space here is powerful
     // it is a closure for your scene which allows you to initialize systems, load assets, and more.

-     // return a Scene object
+
+   const ui = create_ui(HelloWorld, {
+       name: "world",
+   })
+

    return {
        // required
        name: "Hello World",
        update: (ticker) => {},
        // below are optional, but likely to be used
        // init: () => {},
        enter: () => {
+
+           const dismount = ui.mount();
+
+           return () => {
+               dismount();
+           };
+       },
    }
});
```

## Manipulating UI

### From your scene

Manipulating state is as simple as manipulating the `state` object of the bridge.
The state object should match the `props` of your component.

So, for the hello world example, you could update the text dynamically at any time by just calling:

```ts
ui.state.name = "test";
```

### Notifying your scene

You can communicate to your scene from your UI via svelte's events—primarily by dispatching events yourself.

```svelte
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch("notify")} on:click>Click</button>
```

Then, in your scene:

```ts
ui.on("notify", (e: CustomEvent<void>) => {
  console.log("Hello from scene");
});
```

While unlikely—If your UI has it's own state that the UI needs to know about in _real-time_, you can add a reactive statement that dispatches.

```svelte
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let count: number = 10;

  $: dispatch("count", count);

  function addOne() {
    count += 1;
  }
</script>

<p>{count}</p>

<button on:click={addOne}>Add +1</button>
```
