import { app } from "$lib/core/app.ts"
import { Scenes, type Scene } from "$lib/core/scene.ts"
import { Container, Application } from "pixi.js";


export default Scenes.create(() => {

    const stage = new Container({
        label: ""
    });

    return {
        name: "scene_1",

        update: function (t): void {
            
        },
    }
})