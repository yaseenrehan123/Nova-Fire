import { LoadAssets } from "./loadAssets.js";
import { Game } from "./game.js";
import { ChangeView } from "./changeview.js";
const loader = new LoadAssets();
loader.preloadImages((images) => {
    start(images);
    
});
function start(images){
    const options = {
        loadedImages: images,
    }
    const game = new Game(options);
    const player = game.spawnEntity({
        key:'player'
    });
    const battery = game.spawnEntity({
        key:'battery',
        pos:{x:300,y:300}
    });

    const enemy = game.spawnEntity({
        key:'enemy',
        pos:{x:500,y:500}
    });
    /*
    new ChangeView({
        newRotation:0,
        game:game
    });
    */
    console.log('start called');
};