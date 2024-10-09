import { Application, Sprite, Assets, Container } from 'pixi.js';
import { GameTime } from './gametime';
import { Scenes } from './scene';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
export const app = new Application();


export const initialize = async (background: string = "#1099bb") => {

    // Wait for the Renderer to be available
    await app.init({ background, resizeTo: window });
    
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.canvas);

    // Listen for frame updates
    app.ticker.add((time) => {
        GameTime.update(time.deltaMS);
        // Scenes.update(time.deltaMS);
    });
}



