import { create_ui } from "./ui.svelte.js";
import UI_Test from "../scenes/UI_Test.svelte";

// This file exists for type testing

const ui = create_ui(UI_Test, {
  title: "Hello World",
  count: 4,
});
