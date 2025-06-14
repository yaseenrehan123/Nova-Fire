import { Engine as MatterEngine, Runner as MatterRunner, Events, Body } from 'matter-js'
export class Physics {
    constructor(game) {
        this.game = game;

        this.initializeMatter();
    }
    initializeMatter() {

        const engine = MatterEngine.create();
        const runner = MatterRunner.create();


        engine.world.gravity.scale = 0;

        MatterRunner.run(runner, engine);

        this.game.matter.matterEngine = engine;
        this.game.matter.matterRunner = runner;

        this.collisionDetection();

    }
    collisionDetection() {
        Events.on(this.game.matter.matterEngine, 'collisionStart', (event) => {
            //console.log("COLLISION START", event.pairs.length);
            for (let pair of event.pairs) {
                const { bodyA, bodyB } = pair;
                const a = bodyA.label;
                const b = bodyB.label;
                //console.log("a:",a);
                //console.log("b:",b);
                if (this.matchCollision(a, b, 'playerBullet', 'enemy')) {
                    // subtract enemy hp
                    const bulletEntity = a === 'playerBullet' ? bodyA.gameObject : bodyB.gameObject;
                    const enemyEntity = a === 'enemy' ? bodyA.gameObject : bodyB.gameObject;

                    const damageComponent = bulletEntity.getComponent('damage');

                    if (damageComponent) {
                        const enemyPos = enemyEntity.getComponent('pos');
                        const isEnemyDead = this.game.gameUtils.damageEntity({
                            entity: enemyEntity,
                            damageComponent: damageComponent
                        });
                        if (isEnemyDead) {
                            this.game.gameUtils.dropLoot(enemyPos);
                        }
                    };

                    this.game.gameUtils.removeEntity(bulletEntity);

                    //console.log("PlayerBullet collided with enemy");
                }
                else if (this.matchCollision(a, b, 'player', 'enemy')) {
                    // subtract player hp and give invincibility frames
                    const playerEntity = a === 'player' ? bodyA.gameObject : bodyB.gameObject;
                    const enemyEntity = a === 'enemy' ? bodyA.gameObject : bodyB.gameObject;
                    if (this.game.gameUtils.isInvincibilityActive(playerEntity)) return;/*no collision as long as 
                    invincibility is active */
                    const damageComponent = enemyEntity.getComponent('damage');
                    const isPlayerDead = this.game.gameUtils.damageEntity({
                        entity: playerEntity,
                        damageComponent: damageComponent
                    });
                    if (isPlayerDead) {
                        console.log("PLAYER DEAD!");
                        this.game.gameUtils.gameover();
                        return;
                    }
                    this.game.gameUtils.activateInvincibility(playerEntity);
                    //set healthbar
                    this.game.ui.playerUi.updateHealthBar();
                    //console.log("Player health: " , playerEntity.getComponent('health'));
                    const playerEntityPos = playerEntity.getComponent('pos');
                    this.game.gameUtils.spawnParticles({
                        pos: {
                            x: playerEntityPos.x,
                            y: playerEntityPos.y
                        }
                    })
                    // destroy enemy
                    if (!enemyEntity.hasComponent('boss')) {
                        this.game.gameUtils.removeEntity(enemyEntity);
                    }

                    //console.log("Player collided with enemy");

                    this.game.gameUtils.playSfx('playerShipExplosion');
                }
                else if (this.matchCollision(a, b, 'player', 'item')) {
                    const playerEntity = a === 'player' ? bodyA.gameObject : bodyB.gameObject;
                    const itemEntity = a === 'item' ? bodyA.gameObject : bodyB.gameObject;
                    //console.log("Player entity in matchCollision",playerEntity)
                    const changeSpawnKeyComponent = itemEntity.getComponent('changeSpawnKey');
                    const changeDelayComponent = itemEntity.getComponent('changeDelayComponent');
                    const changeShootTimesComponent = itemEntity.getComponent('changeShootTimes');

                    if (changeSpawnKeyComponent) {
                        this.game.gameUtils.changeShootBullet({
                            entity: playerEntity,
                            changeSpawnKeyComponent: changeSpawnKeyComponent
                        });
                    }

                    if (changeDelayComponent) {
                        this.game.gameUtils.changeShootDelay({
                            entity: playerEntity,
                            changeDelayComponent: changeDelayComponent
                        })
                    }

                    if (changeShootTimesComponent) {
                        this.game.gameUtils.changeShootTimes({
                            entity: playerEntity,
                            changeShootTimesComponent: changeShootTimesComponent
                        })
                    }
                    //console.log("Body B gameObject: ",itemEntity);
                    //console.log("Player collided with an item!");
                    this.game.gameUtils.removeEntity(itemEntity);

                    this.game.gameUtils.playSfx('powerUpGrab');
                }
                else if (this.matchCollision(a, b, 'player', 'enemyBullet')) {
                    const playerEntity = a === 'player' ? bodyA.gameObject : bodyB.gameObject;
                    const enemyBulletEntity = a === 'item' ? bodyA.gameObject : bodyB.gameObject;

                    console.log("player collided with enemy bullet!");

                    if (this.game.gameUtils.isInvincibilityActive(playerEntity)) return;/*no collision as long as 
                    invincibility is active */
                    const damageComponent = enemyBulletEntity.getComponent('damage');
                    const isPlayerDead = this.game.gameUtils.damageEntity({
                        entity: playerEntity,
                        damageComponent: damageComponent
                    });
                    if (isPlayerDead) {
                        console.log("PLAYER DEAD!");
                        this.game.gameUtils.gameover();
                        return;
                    }
                    this.game.gameUtils.activateInvincibility(playerEntity);
                    //set healthbar
                    this.game.ui.playerUi.updateHealthBar();
                    //console.log("Player health: " , playerEntity.getComponent('health'));
                    const playerEntityPos = playerEntity.getComponent('pos');
                    this.game.gameUtils.spawnParticles({
                        pos: {
                            x: playerEntityPos.x,
                            y: playerEntityPos.y
                        }
                    })
                    // destroy bullet
                   
                    this.game.gameUtils.removeEntity(enemyBulletEntity);
                    

                    //console.log("Player collided with enemy");

                    this.game.gameUtils.playSfx('playerShipExplosion');
                }
            };


        });
    };
    matchCollision(a, b, label1, label2) {
        return (a === label1 && b === label2) || (a === label2 && b === label1);
    };
}
