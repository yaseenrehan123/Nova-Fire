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

    const yellowBattery = game.gameUtils.spawnEntity({
        passedKey: 'yellowBattery',
        componentsToModify: {
            pos: { x: 200, y: 400 },
            rotation: 180 + game.totalSceneRotation,
            baseRotation: 180,
            matterBodyOptions: {
                label: "item",
                collisionFilter: {
                    category: game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }

            }
        }
    });

    //game.assignParent(yellowBattery, game.sceneEntity);

    const purpleBattery = game.gameUtils.spawnEntity({
        passedKey: 'purpleBattery',
        componentsToModify: {
            pos: { x: 400, y: 400 },
            rotation: 180 + game.totalSceneRotation,
            baseRotation: 180,
            matterBodyOptions: {
                label: "item",
                collisionFilter: {
                    category: game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }

            }
        }

    });

    //game.assignParent(purpleBattery, game.sceneEntity);

    const greenBattery = game.gameUtils.spawnEntity({
        passedKey: 'greenBattery',
        componentsToModify: {
            pos: { x: 600, y: 400 },
            rotation: 180 + game.totalSceneRotation,
            baseRotation: 180,
            matterBodyOptions: {
                label: "item",
                collisionFilter: {
                    category: game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }

            }
        }
    });

    //game.assignParent(greenBattery, game.sceneEntity);

    const blueBattery = game.gameUtils.spawnEntity({
        passedKey: 'blueBattery',
        componentsToModify: {
            pos: { x: 800, y: 400 },
            rotation: 180 + game.totalSceneRotation,
            baseRotation: 180,
            matterBodyOptions: {
                label: "item",
                collisionFilter: {
                    category: game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }

            }
        }
    });

    //game.assignParent(blueBattery, game.sceneEntity);

    const powerup = game.gameUtils.spawnEntity({
        passedKey: 'powerup',
        componentsToModify: {
            pos: { x: 1000, y: 400 },
            rotation: 180 + game.totalSceneRotation,
            baseRotation: 180,
            matterBodyOptions: {
                label: "item",
                collisionFilter: {
                    category: game.collisionCategories.itemCategory,
                    mask: game.collisionCategories.playerCategory
                }

            }
        }
    });

    //game.assignParent(powerup, game.sceneEntity);

    const enemy1 = game.gameUtils.spawnEntity({
        passedKey: 'enemy1',
        componentsToModify: {
            pos: { x: 1200, y: 300 },
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

    //game.assignParent(enemy1, game.sceneEntity);

    const enemy2 = game.gameUtils.spawnEntity({
        passedKey: 'enemy2',
        componentsToModify: {
            pos: { x: 1400, y: 300 },
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

    //game.assignParent(enemy2, game.sceneEntity);

    const enemy3 = game.gameUtils.spawnEntity({
        passedKey: 'enemy3',
        componentsToModify: {
            pos: { x: 1600, y: 300 },
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

    //game.assignParent(enemy3, game.sceneEntity);

    new ChangeView({
        newRotation: 0,
        game: game
    });

    console.log('start called');
};