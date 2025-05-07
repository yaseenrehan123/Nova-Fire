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
        console.log("COLLISION START", event.pairs.length);
            for (let pair of event.pairs){
                const {bodyA,bodyB} = pair;
                const a = bodyA.label;
                const b = bodyB.label;
                console.log(a,b);
                if(this.matchCollision(a,b,'playerBullet','enemy')){
                    // subtract enemy hp
                    const bullet = bodyA.label === 'playerBullet' ? bodyA.gameObject : bodyB.gameObject;
                    const enemy = bodyB.label === 'enemy' ? bodyB.gameObject : bodyA.gameObject;
                    enemy.takeDamage(bullet.damage);
                    bullet.die();
                }
                else if(this.matchCollision(a,b,'player','enemy')){
                    // subtract player hp and give invincibility frames
                    // destroy enemy
                    console.log("Player collided with enemy");
                }
                else if(this.matchCollision(a,b,'player','item')){
                    console.log("Player collided with an item!");
                }
            };
            
            
        });
    };
    matchCollision(a, b, label1, label2) {
        return (a === label1 && b === label2) || (a === label2 && b === label1);
    };
}
