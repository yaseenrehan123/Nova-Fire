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
    const yellowBattery = game.spawnEntity({
        passedKey:'yellowBattery',
        componentsToModify:{
            pos:{x:300,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                isSensor: false,
                collisionFilter:{
                    group:0,
                    category:game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }
                    
            }
        }
       })
    const purpleBattery = game.spawnEntity({
        passedKey: 'purpleBattery',
        componentsToModify:{
            pos:{x:400,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                isSensor: false,
                collisionFilter:{
                    group:0,
                    category:game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }
                    
            }
        }
        
    })
    const greenBattery = game.spawnEntity({
        passedKey: 'greenBattery',
        componentsToModify:{
            pos:{x:500,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                isSensor: false,
                collisionFilter:{
                    group:0,
                    category:game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }
                    
            }
        }
    })
    const blueBattery = game.spawnEntity({
        passedKey: 'blueBattery',
        componentsToModify:{
            pos:{x:600,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                isSensor: false,
                collisionFilter:{
                    group:0,
                    category:game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }
                    
            }
        }
    })
    new ChangeView({
        newRotation:0,
        game:game
    });
    
    console.log('start called');
};