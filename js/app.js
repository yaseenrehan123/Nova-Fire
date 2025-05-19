import { LoadAssets } from "./loadAssets.js";
import { Game } from "./game.js";
import { ChangeView } from "./changeview.js";
import { Player } from "./player.js";
import { Ui } from "./ui.js";
const loader = new LoadAssets(start);

function start(resources){
    console.log(resources);
    const game = new Game(resources);
    
    game.player = new Player(game)
    game.ui = new Ui(game);

    const yellowBattery = game.spawnEntity({
        passedKey:'yellowBattery',
        componentsToModify:{
            pos:{x:200,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                collisionFilter:{
                    category:game.collisionCategories.itemCategory,
                    mask:game.collisionCategories.playerCategory
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
                collisionFilter:{
                    category:game.collisionCategories.itemCategory,
                    mask:game.collisionCategories.playerCategory
                }
                    
            }
        }
        
    })
    const greenBattery = game.spawnEntity({
        passedKey: 'greenBattery',
        componentsToModify:{
            pos:{x:600,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                collisionFilter:{
                    category:game.collisionCategories.itemCategory,
                    mask:game.collisionCategories.playerCategory
                }
                    
            }
        }
    })
    const blueBattery = game.spawnEntity({
        passedKey: 'blueBattery',
        componentsToModify:{
            pos:{x:800,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                collisionFilter:{
                    category:game.collisionCategories.itemCategory,
                    mask:game.collisionCategories.playerCategory
                }
                    
            }
        }
    })
    const powerup = game.spawnEntity({
        passedKey: 'powerup',
        componentsToModify:{
            pos:{x:1000,y:400},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
            matterBodyOptions:{
                label: "item",
                collisionFilter:{
                    category:game.collisionCategories.itemCategory,
                    mask:game.collisionCategories.playerCategory
                }
                    
            }
        }
    })
    const enemy1 = game.spawnEntity({
        passedKey:'enemy1',
        componentsToModify:{
            pos:{x:1200,y:300},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
             matterBodyOptions:{
                label: "enemy",
                collisionFilter:{
                    category:game.collisionCategories.enemyCategory,
                    mask:game.collisionCategories.playerCategory | game.collisionCategories.playerBulletCategory
                }
                    
            }
        }
    });
    const enemy2 = game.spawnEntity({
        passedKey:'enemy2',
        componentsToModify:{
            pos:{x:1400,y:300},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
             matterBodyOptions:{
                label: "enemy",
                collisionFilter:{
                    category:game.collisionCategories.enemyCategory,
                    mask:game.collisionCategories.playerCategory | game.collisionCategories.playerBulletCategory
                }
                    
            }
        }
    });
    const enemy3 = game.spawnEntity({
        passedKey:'enemy3',
        componentsToModify:{
            pos:{x:1600,y:300},
            rotation: 180 + game.totalSceneRotation,
            baseRotation:180,
             matterBodyOptions:{
                label: "enemy",
                collisionFilter:{
                    category:game.collisionCategories.enemyCategory,
                    mask:game.collisionCategories.playerCategory | game.collisionCategories.playerBulletCategory
                }
                    
            }
        }
    });
    new ChangeView({
        newRotation:0,
        game:game
    });
    
    console.log('start called');
};