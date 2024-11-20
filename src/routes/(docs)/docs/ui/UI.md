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
This example builds upon the <i>Getting Started</i> example.

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

Manipulating state is as simple as manipulating the `props` object provided to `create_ui`, or the `props` object returned from `create_ui`.

So, for the hello world example, you could update the text dynamically at any time by just calling:

```ts
ui.props.name = "twirled";
```

## Alternative UI

if your UI needs to be tightly bound to a specific system, you can use the `ui_proxy` function:

```ts
import { ui_proxy } from "squander";

const system_state = ui_proxy({
  todos: [],
});

const ui = create_ui(HelloWorld, {
  something: system_state,
});

const other_system = create_system(system_state);
```

Note: It's best to use an object for this, not a primitive type.
