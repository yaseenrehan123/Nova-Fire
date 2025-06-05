import { LoadAssets } from "./loadAssets.js";
import { Game } from "./game.js";
import { ChangeView } from "./changeview.js";
import { Player } from "./player.js";
import { Ui } from "./ui/ui.js";
const loader = new LoadAssets(start);

function start(resources) {
    console.log(resources);
    const game = new Game(resources);

    game.player = new Player(game)
    game.ui = new Ui(game);

    /*
    const boss1 = game.gameUtils.spawnEntity({
        passedKey: 'boss1',
        componentsToModify: {
            pos: { x: 1600, y: 150 },
            rotation: 180 + game.totalSceneRotation,
            baseRotation: 180,
            matterBodyOptions: {
                label: "enemy",
                collisionFilter: {
                    category: game.collisionCategories.enemyCategory,
                    mask: game.collisionCategories.playerCategory | game.collisionCategories.playerBulletCategory
                }

            }
        }
    });
    */
    
   
    console.log('start called');
    console.log("PLAYER EXISTS?",game.gameUtils.entityExists(game.player.playerEntity));
};