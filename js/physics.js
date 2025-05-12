import {Engine as MatterEngine,Runner as MatterRunner,Events, Body} from 'matter-js'
export class Physics{
    constructor(game){
        this.game = game;

        this.initializeMatter();
    }
    initializeMatter(){

        const engine = MatterEngine.create();
        const runner = MatterRunner.create();
    
        
        engine.world.gravity.scale = 0;
        
        MatterRunner.run(runner,engine);

        this.game.matter.matterEngine = engine;
        this.game.matter.matterRunner = runner;

        this.collisionDetection();
       
    }
    collisionDetection(){
       Events.on(this.game.matter.matterEngine,'collisionStart',(event)=>{
        //console.log("COLLISION START", event.pairs.length);
            for (let pair of event.pairs){
                const {bodyA,bodyB} = pair;
                const a = bodyA.label;
                const b = bodyB.label;
                //console.log("a:",a);
                //console.log("b:",b);
                if(this.matchCollision(a,b,'playerBullet','enemy')){
                    // subtract enemy hp
                    const bulletEntity = a === 'playerBullet' ? bodyA.gameObject : bodyB.gameObject;
                    const enemyEntity = a === 'enemy' ? bodyA.gameObject : bodyB.gameObject;
                    
                    const damageComponent = bulletEntity.getComponent('damage');

                    if(damageComponent){
                        this.game.damageEntity({
                            entity:enemyEntity,
                            damageComponent:damageComponent
                        });
                    };

                    this.game.removeEntity(bulletEntity);

                    //console.log("PlayerBullet collided with enemy");
                }
                else if(this.matchCollision(a,b,'player','enemy')){
                    // subtract player hp and give invincibility frames
                    const playerEntity = a === 'player' ? bodyA.gameObject : bodyB.gameObject;
                    const enemyEntity = a === 'enemy' ? bodyA.gameObject : bodyB.gameObject;
                    const damageComponent = enemyEntity.getComponent('damage');
                    this.game.damageEntity({
                        entity:playerEntity,
                        damageComponent:damageComponent
                    });
                    //set healthbar
                    this.game.ui.playerUi.updateBar();
                    console.log("Player health: " , playerEntity.getComponent('health'));
                    // destroy enemy
                    this.game.removeEntity(enemyEntity);
                    //console.log("Player collided with enemy");
                }
                else if(this.matchCollision(a,b,'player','item')){
                    const playerEntity = a === 'player' ? bodyA.gameObject : bodyB.gameObject;
                    const itemEntity = a === 'item' ? bodyA.gameObject : bodyB.gameObject;
                    //console.log("Player entity in matchCollision",playerEntity)
                    const changeSpawnKeyComponent = itemEntity.getComponent('changeSpawnKey');
                    const changeDelayComponent = itemEntity.getComponent('changeDelayComponent');
                    const changeShootTimesComponent = itemEntity.getComponent('changeShootTimes');

                    if(changeSpawnKeyComponent){
                        this.game.changeShootBullet({
                            entity:playerEntity,
                            changeSpawnKeyComponent:changeSpawnKeyComponent
                        });
                    }
                    
                    if(changeDelayComponent){
                        this.game.changeShootDelay({
                            entity:playerEntity,
                            changeDelayComponent:changeDelayComponent
                        })
                    }
                   
                    if(changeShootTimesComponent){
                        this.game.changeShootTimes({
                            entity:playerEntity,
                            changeShootTimesComponent:changeShootTimesComponent
                        })
                    }
                    //console.log("Body B gameObject: ",itemEntity);
                    //console.log("Player collided with an item!");
                    this.game.removeEntity(itemEntity);
                }
            };
            
            
        });
    };
    matchCollision(a, b, label1, label2) {
        return (a === label1 && b === label2) || (a === label2 && b === label1);
    };
}
