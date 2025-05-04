import { LoadAssets } from "./loadAssets.js";
import { Game } from "./game.js";
import { ChangeView } from "./changeview.js";
import { Player } from "./player.js";
const loader = new LoadAssets(start);

function start(resources){
    console.log(resources);
    const game = new Game(resources);
    
   new Player(
    {
        game:game
    }
    );
    /*
    const blueBattery = game.spawnEntity({
        key:'blueBattery',
        pos:{x:300,y:300}
    });
    const yellowBattery = game.spawnEntity({
        key:'yellowBattery',
        pos:{x:380,y:300}
    });
    const greenBattery = game.spawnEntity({
        key:'greenBattery',
        pos:{x:460,y:300}
    });
    const purpleBattery = game.spawnEntity({
        key:'purpleBattery',
        pos:{x:200,y:300}
    });
    */
    const enemy = game.spawnEntity({
        key:'enemy',
        pos:{x:500,y:500}
    });
    
    new ChangeView({
        newRotation:90,
        game:game
    });
    
    console.log('start called');
};