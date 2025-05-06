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
    setInterval(() => {
        const yellowBattery = game.spawnEntity({
            passedKey:'yellowBattery',
            componentsToModify:{
                pos:{x:300,y:400},
                rotation: 180 + game.totalSceneRotation,
                baseRotation:180
            }
           })
    }, 2000);
    */
    
    new ChangeView({
        newRotation:90,
        game:game
    });
    
    console.log('start called');
};