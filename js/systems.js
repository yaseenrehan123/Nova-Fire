import { Body } from "matter-js";

export class Systems{
    constructor(options){
       const {
            game = null,
        } = options;

        this.game = game;

        this.customSystems = null;
        this.ecsSystems = null;

        this.start();
    }
    start(){
        this.customSystems = new CustomSystems(
            {
                game:this.game
            }
        );
            
        this.ecsSystems = new ECSSystems(
            {
                game:this.game
            }
        );

    }
   
}
class CustomSystems{
    constructor(options){
        const{
            game = null
        } = options

        this.game = game;
    }
    addSceneRotation(){
        const req = ['rotation', 'sceneOrientedRotation','baseRotation'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);
    
         for (let e of entities) {
            if (!req.every(c => e.hasComponent(c))) continue;

            let baseRotation = e.getComponent('baseRotation');
            let rotation = 0;
            rotation = baseRotation + this.game.sceneRotation;
            
            e.setComponent('rotation',rotation);
        }
    }
    setBaseRotation(){
        const req = ['rotation', 'sceneOrientedRotation','baseRotation'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);
        for (let e of entities) {
            if (!req.every(c => e.hasComponent(c))) continue;
            const rotation = e.getComponent('rotation');
            let baseRotation = 0;
            baseRotation = rotation - this.game.sceneRotation;
            
            e.setComponent('baseRotation',baseRotation)// set base rotation to rotation
        }
    }
    debugMatterBodies(){
            if (this.game.matter.debugBodies) {
                //const builder = this.shapeBuilder.builder;
                //builder.clear();
        
                const req = ['pos', 'matterBody', 'matterBodyType','rotation'];
                const entities = Object.values(this.game.ecs.entityEngine.entities);
        
                for (let e of entities) {
                    if (!req.every(c => e.hasComponent(c))) continue;
        
                    //const pos = e.getComponent('pos');
                    const body = e.getComponent('matterBody');
                    const bodyType = e.getComponent('matterBodyType');
                    const offset = e.getComponent('matterBodyOffset') || { x: 0, y: 0 };
                    const color = e.getComponent('matterBodyColor') || 'white';
                    const rotation = e.getComponent('rotation');
                    //console.log(body.position);
                    //console.log(body.position.x + offset.x)

                    const ctx = this.game.ctx;

                    switch (bodyType) {
                        case 'rectangle':
                            const bodyWidth = e.getComponent('matterBodyWidth');
                            const bodyHeight = e.getComponent('matterBodyHeight');
                            
                            // --- Save the current context ---
                            ctx.save();
        
                            // --- Translate to center of the rectangle ---
                            const rotatedOffset = this.game.rotateOffset(offset,rotation)
                            ctx.translate(body.position.x + rotatedOffset.x, body.position.y + rotatedOffset.y);
                            
                            // --- Rotate the context ---
                            ctx.rotate(body.angle);
        
                            // --- Draw the rectangle manually ---
                            ctx.fillStyle = color;
                            ctx.fillRect(-bodyWidth/2, -bodyHeight/2, bodyWidth, bodyHeight);
        
                            // --- Restore context to original (important) ---
                            ctx.restore();
                            break;
                        
                        case 'circle':
                            const radius = e.getComponent('matterBodyRadius');    

                            ctx.save();
                            ctx.translate(body.position.x + offset.x, body.position.y + offset.y);
                            ctx.beginPath();
                            ctx.arc(0, 0, radius, 0, Math.PI * 2);
                            ctx.fillStyle = color;
                            ctx.fill();
                        
                            ctx.restore();

                            break;

                        default:
                            console.error("An unidentified shape type entered debugMatterBodies!");
                            break;    
                    }
                }
            }
            
        }
    drawSprites() {
        const req = ['imgKey','pos','width','height','rotation','centerImage'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);
    
        for (let e of entities) {
          // only draw if it has every required component
          if (!req.every(c => e.hasComponent(c))) continue;
    
          // grab them out
          const imgKey      = e.getComponent('imgKey');
          const pos         = e.getComponent('pos');
          const width       = e.getComponent('width');
          const height      = e.getComponent('height');
          const rotation    = e.getComponent('rotation');
          const centerImage = e.getComponent('centerImage');
          //console.log(`rotation passed in drawSprites: ${rotation}`);
          // lookup your preloaded Image object
          const img = this.game.images[imgKey];
          if (!img) {
            console.warn(`No image for key "${imgKey}"`);
            continue;
          }
    
          // call your helper
          this.game.drawImage({
            img,
            pos,
            width,
            height,
            rotation,
            centerImage
          });
        }

               
    }
}
class ECSSystems{
    constructor(options){
        const{
            game = null,
        } = options;

        this.game = game;
    }
    changeBodyRotationSystem(){
        const engine = this.game.ecs.entityEngine;
        engine.system('rotationMatterBodies',['rotation','matterBody','matterBodyType'],(entity,{
            rotation,matterBody,matterBodyType
        })=>{
            const typesToRotate = ['rectangle'];
            if(!typesToRotate.includes(matterBodyType))return;
            const rotationInRadians = rotation * (Math.PI / 180);
            Body.setAngle(matterBody,rotationInRadians);
            //console.log(`entity rotation ${rotation}`);
        });
    }
    
    movePlayerSystem(){
        const engine = this.game.ecs.entityEngine;
        engine.system('movePlayer',['player','speed','moveVector','pos','matterBody'],
            (entity,{player,speed,moveVector,pos,matterBody})=>{
                const mouseX = this.game.mouse.pos.x;
                const mouseY = this.game.mouse.pos.y;
                const playerX = pos.x;
                const playerY = pos.y;
    
                let moveVectorX = mouseX - playerX;
                let moveVectorY = mouseY - playerY;
                const distance = Math.hypot(moveVectorX, moveVectorY);
    
                // Avoid division by zero
                if (distance > 50) {
                    const maxSpeed = speed;
                    const speedFactor = Math.min(distance / 20, 1); // Smoothly slow near target
                    const targetSpeed = maxSpeed * speedFactor;
    
                    moveVectorX /= distance;
                    moveVectorY /= distance;
    
                    Body.setVelocity(matterBody, {
                        x: moveVectorX * targetSpeed,
                        y: moveVectorY * targetSpeed,
                    });
                } else {
                    Body.setVelocity(matterBody, { x: 0, y: 0 });
                }
    
                pos.x = matterBody.position.x;
                pos.y = matterBody.position.y;
                entity.setComponent('moveVector',{x:moveVectorX,y:moveVectorY});
                entity.setComponent('pos',pos);
            }
        );
    }
    moveEntitiesSystem(){//used to move all entities 
        const engine = this.game.ecs.entityEngine;
        engine.system('moveObjects',['pos','rotation','matterBody','moveVector','speed','notPlayer'],
            (entity,{pos,rotation,matterBody,moveVector,speed,notPlayer})=>{
                const rad = rotation * (Math.PI / 180)
                //console.log(`${entity.name} + ${pos.x}`)
                moveVector = {
                    x: Math.sin(rad),
                    y:-Math.cos(rad)
                };

                const EPSILON = 0.0001;
                if (Math.abs(moveVector.x) < EPSILON) moveVector.x = 0;
                if (Math.abs(moveVector.y) < EPSILON) moveVector.y = 0;

                //console.log(moveVector);

                Body.setVelocity(matterBody,{
                    x: moveVector.x * speed,
                    y: moveVector.y * speed
                });

                pos.x = matterBody.position.x;
                pos.y = matterBody.position.y;

                entity.setComponent('moveVector',moveVector);
                entity.setComponent('pos',pos);
            }
        )
    };
    shootBulletsSystem(){
        const engine = this.game.ecs.entityEngine;
        engine.system('shootBullets',['pos','shootBullet','rotation','spawnPos','shootTimes'],
            (entity,{pos,shootBullet,rotation,spawnPos,shootTimes})=>{
                if(shootBullet.counter > 0){
                    shootBullet.counter -= this.game.deltaTime;
                    entity.setComponent('shootBullet',shootBullet);
                    return;
                }
                
                if(!shootBullet.active)return;
                spawnPos.forEach((point)=>{
                    if(shootTimes <= 0) return;


                    const rotated = this.game.rotateOffset(point.offset, rotation);

                    point.pos.x = pos.x + rotated.x;
                    point.pos.y = pos.y + rotated.y;

                    this.game.spawnEntity({
                        passedKey:shootBullet.spawnKey,
                        componentsToModify:{
                            pos:{
                                x:point.pos.x,
                                y:point.pos.y
                            },
                            rotation:rotation,
                            baseRotation:rotation
                        }
                        
                    });
                    shootTimes--;
                });
               
                
                shootBullet.counter = shootBullet.delayInSeconds;
                
                entity.setComponent('shootBullet',shootBullet);
            }
        )
    }
}
