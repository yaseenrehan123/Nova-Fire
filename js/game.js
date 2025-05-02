import {Mouse} from './mouse.js';
import { CreateEntity } from "./createEntity.js";
import {Engine as EntityEngine,Simulator as EntitySimulator} from 'jecs';
import {Engine as MatterEngine,Runner as MatterRunner,Events, Body} from 'matter-js'
//import { Builder, shapes } from "shape-builder";
//const { Point, Rectangle } = shapes;

export class Game{
    constructor(options){
        const {
            loadedImages = null,
        } = options;

        this.canvas = document.querySelector('.game-container');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.images = loadedImages;
        this.lastTime = 0;
        this.deltaTime = null;
        this.registeredObj = [];
        this.ecs = {
            entityEngine: null,
            entitySim: null,
        };
        this.matter = {
            matterEngine:null,
            matterRunner:null,
            debugBodies:false
        };
        /*
        this.shapeBuilder ={
            builder:null
        }
        */
        this.collisionCategories={
            playerCategory:0x0001,
            itemCategory:0x0002,
            playerBulletCategory:0x0004,
            enemyCategory:0x0008
        };
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.screenCenterPos = {x:this.width/2,y:this.height/2};
        this.sceneRotation = 0;
        this.mouse = new Mouse(this);
       
        this.start();
        this.update();
    };
    start(){
        this.initializeJECS();
        this.initializeMatter();
        //this.initializeShapeBuilder();

        this.onResize();
        
        this.systemsJECS();

        //this.debugMatterBodies();
    };
    update(timeStamp){
        const deltaTime = (timeStamp - this.lastTime)/1000;
        this.lastTime = timeStamp;
        this.deltaTime = deltaTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.shapeBuilder.builder.removeShapes();

        this.drawSprites()
        this.debugMatterBodies();
        //this.shapeBuilder.builder.draw(this.ctx);

        this.registeredObj.forEach((obj)=>{
            obj.update();
        });
        //console.log(`Scene Rotation: ${this.sceneRotation}`);
        requestAnimationFrame(this.update.bind(this));
    };
    addObj(obj){
        this.registeredObj.push(obj);
    };
    drawImage({
        img,
        pos = { x: 0, y: 0 },
        width,
        height,
        centerImage = true,
        rotation = 0,
      }) {
        const ctx = this.ctx;
        // local offsets
        const offsetX = centerImage ? -width  / 2 : 0;
        const offsetY = centerImage ? -height / 2 : 0;
      
        ctx.save();
        // 1) move origin to sprite pos
        ctx.translate(pos.x, pos.y);
        // 2) rotate around that origin
        //console.log(rotation)
        ctx.rotate((rotation) * Math.PI / 180);
        // 3) draw relative to (0,0) — offset so your image is centered if desired
        ctx.drawImage(img, offsetX, offsetY, width, height);
        ctx.restore();
        //console.log(`rotation passed in drawImage ${rotation}`)
      }
      
    initializeJECS(){
        this.ecs.entityEngine = new EntityEngine();
        this.ecs.entitySim = new EntitySimulator(this.ecs.entityEngine);
        this.ecs.entitySim.setFps(60);
        this.ecs.entitySim.start();
    };
    onResize(){
        this.canvas.addEventListener('resize',()=>{
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.screenCenterPos = {x:this.width/2,y:this.height/2};
        });
    }
    systemsJECS(){
        this.changeBodyRotationSystem();
        this.movePlayerSystem();
        this.moveEntitiesSystem();
        this.shootBulletsSystem();
    };
    drawSprites() {
        const req = ['imgKey','pos','width','height','rotation','centerImage'];
        const entities = Object.values(this.ecs.entityEngine.entities);
    
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
          const img = this.images[imgKey];
          if (!img) {
            console.warn(`No image for key "${imgKey}"`);
            continue;
          }
    
          // call your helper
          this.drawImage({
            img,
            pos,
            width,
            height,
            rotation,
            centerImage
          });
        }
      }
    initializeMatter(){

        this.matter.matterEngine = MatterEngine.create();
        this.matter.matterRunner = MatterRunner.create();
    
        
        this.matter.matterEngine.world.gravity.scale = 0;
        
        MatterRunner.run(this.matter.matterRunner,this.matter.matterEngine);
        this.collisionDetection();
       
    }
    collisionDetection(){
       Events.on(this.matter.matterEngine,'collisionStart',(event)=>{
            for (let pair of event.pairs){
                const {bodyA,bodyB} = pair;
                const a = bodyA.label;
                const b = bodyB.label;
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
    /*
    initializeShapeBuilder(){
        const builder = new Builder();
        this.shapeBuilder.builder = builder;
    }
    */
    debugMatterBodies(){
        if (this.matter.debugBodies) {
            //const builder = this.shapeBuilder.builder;
            //builder.clear();
    
            const req = ['pos', 'matterBody', 'matterBodyType'];
            const entities = Object.values(this.ecs.entityEngine.entities);
    
            for (let e of entities) {
                if (!req.every(c => e.hasComponent(c))) continue;
    
                const pos = e.getComponent('pos');
                const body = e.getComponent('matterBody');
                const bodyType = e.getComponent('matterBodyType');
                const offset = e.getComponent('matterBodyOffset') || { x: 0, y: 0 };
                const color = e.getComponent('matterBodyColor') || 'white';
                //console.log(body.position);
                //console.log(body.position.x + offset.x)
                switch (bodyType) {
                    case 'rectangle':
                        const bodyWidth = e.getComponent('matterBodyWidth');
                        const bodyHeight = e.getComponent('matterBodyHeight');
                        
                        // --- Save the current context ---
                        this.ctx.save();
    
                        // --- Translate to center of the rectangle ---
                        this.ctx.translate(body.position.x + offset.x, body.position.y + offset.y);
                        
                        // --- Rotate the context ---
                        this.ctx.rotate(body.angle);
    
                        // --- Draw the rectangle manually ---
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(-bodyWidth/2, -bodyHeight/2, bodyWidth, bodyHeight);
    
                        // --- Restore context to original (important) ---
                        this.ctx.restore();
                        break;
                    default:
                        console.error("An unidentified shape type entered debugMatterBodies!");
                        break;    
                }
            }
        }
        
    }
    changeBodyRotationSystem(){
        const engine = this.ecs.entityEngine;
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
    addSceneRotation(){
        const req = ['rotation', 'sceneOrientedRotation','baseRotation'];
        const entities = Object.values(this.ecs.entityEngine.entities);
    
         for (let e of entities) {
            if (!req.every(c => e.hasComponent(c))) continue;

            let baseRotation = e.getComponent('baseRotation');
            let rotation = 0;
            rotation = baseRotation + this.sceneRotation;
            
            e.setComponent('rotation',rotation);
        }
    }
    setBaseRotation(){
        const req = ['rotation', 'sceneOrientedRotation','baseRotation'];
        const entities = Object.values(this.ecs.entityEngine.entities);
        for (let e of entities) {
            if (!req.every(c => e.hasComponent(c))) continue;
            const rotation = e.getComponent('rotation');
            let baseRotation = 0;
            baseRotation = rotation - this.sceneRotation;
            
            e.setComponent('baseRotation',baseRotation)// set base rotation to rotation
        }
    }
    movePlayerSystem(){
        const engine = this.ecs.entityEngine;
        engine.system('movePlayer',['player','speed','moveVector','pos','matterBody'],
            (entity,{player,speed,moveVector,pos,matterBody})=>{
                const mouseX = this.mouse.pos.x;
                const mouseY = this.mouse.pos.y;
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
        const engine = this.ecs.entityEngine;
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
        const engine = this.ecs.entityEngine;
        engine.system('shootBullets',['pos','shootBullet','rotation','spawnPos','shootTimes'],
            (entity,{pos,shootBullet,rotation,spawnPos,shootTimes})=>{
                if(shootBullet.counter > 0){
                    shootBullet.counter -= this.deltaTime;
                    entity.setComponent('shootBullet',shootBullet);
                    return;
                }
                if(!shootBullet.active)return;
                spawnPos.forEach((point)=>{
                    if(shootTimes <= 0) return;

                    point.pos.x = pos.x + point.offset.x;
                    point.pos.y = pos.y + point.offset.y;
                    
                    this.spawnEntity({
                        key:shootBullet.spawnKey,
                        pos:{x:point.pos.x,y:point.pos.y},
                        rotation:rotation
                    });
                    shootTimes--;
                });
               
                
                shootBullet.counter = shootBullet.delayInSeconds;
                
                entity.setComponent('shootBullet',shootBullet);
            }
        )
    }
    spawnEntity(options){
        const{
            key='',
            pos=this.screenCenterPos,
            rotation=0,
        } = options;
        let id = null;

        switch (key){
            case 'player':
                id = new CreateEntity({
                    game:this,
                    name:'player',
                    components:[
                        ['imgKey','player'],
                        ['pos',pos],
                        ['width',100],
                        ['height',100],
                        ['rotation',0],
                        ['centerImage',true],
                        ['sceneOrientedRotation',true],// a flag to change rotation with scene
                        ['matterBody',null],// assigned on creation
                        ['matterBodyType','rectangle'],
                        ['matterBodyOffset',{x:0,y:-6}],
                        ['matterBodyWidth',100],
                        ['matterBodyHeight',70],
                        ['matterBodyOptions',{
                            label: 'player',
                            isSensor: true,
                            frictionAir: 0.05,
                            collisionFilter: {
                                group: 0,
                                category: this.collisionCategories.playerCategory,
                                mask: this.collisionCategories.itemCategory | this.collisionCategories.enemyCategory,
                            }
                        }],
                        ['matterBodyColor','white'],
                        ['baseRotation',0],
                        ['moveVector',{x:0,y:0}],
                        ['speed',30],
                        ['player',true],
                        ['shootBullet',{
                            delayInSeconds:1,
                            counter:0,
                            active:true,
                            spawnKey:'greenBullet'

                        }],
                        ['spawnPos', [
                            { pos: {x:0,y:0}, offset: {x:0,y:0} },
                            { pos: {x:0,y:0}, offset: {x:-20,y:-20} },
                            { pos: {x:0,y:0}, offset: {x:20,y:20} }
                        ]],
                        ['shootTimes',1]
                    ]
                }).entity;
                break;
            case 'blueBattery':
                id = new CreateEntity({
                    game:this,
                    name:'blueBattery',
                    components:[
                        ['imgKey','blueBattery'],
                        ['pos',pos],
                        ['width',50],
                        ['height',50],
                        ['rotation',180],
                        ['baseRotation',180],
                        ['centerImage',true],
                        ['matterBody',null],
                        ['matterBodyType','rectangle'],
                        ['matterBodyOffset',{x:0,y:0}],
                        ['matterBodyWidth',50],
                        ['matterBodyHeight',50],
                        ['matterBodyOptions',{
                            label:'item',
                            isSensor:true,
                            collisionFilter:{
                                group:0,
                                category:this.collisionCategories.itemCategory,
                                mask:this.collisionCategories.playerCategory
                            }
                        }],
                        ['speed',2],
                        ['moveVector',{x:0,y:0}],
                        ['notPlayer',true],
                        ['sceneOrientedRotation',true],
                        
                    ]
                }).entity;
                break;
            case 'purpleBattery':
                id = new CreateEntity({
                    game: this,
                    name: 'purpleBattery',
                    components: [
                        ['imgKey', 'purpleBattery'],
                        ['pos', pos],
                        ['width', 50],
                        ['height', 50],
                        ['rotation', 180],
                        ['baseRotation', 180],
                        ['centerImage', true],
                        ['matterBody', null],
                        ['matterBodyType', 'rectangle'],
                        ['matterBodyOffset', { x: 0, y: 0 }],
                        ['matterBodyWidth', 50],
                        ['matterBodyHeight', 50],
                        ['matterBodyOptions', {
                            label: 'item',
                            isSensor: true,
                            collisionFilter: {
                                group: 0,
                                category: this.collisionCategories.itemCategory,
                                mask: this.collisionCategories.playerCategory
                            }
                        }],
                        ['speed', 2],
                        ['moveVector', { x: 0, y: 0 }],
                        ['notPlayer', true],
                        ['sceneOrientedRotation', true],

                    ]
                }).entity;
                break;   
            case 'yellowBattery':
                id = new CreateEntity({
                    game: this,
                    name: 'yellowBattery',
                    components: [
                        ['imgKey', 'yellowBattery'],
                        ['pos', pos],
                        ['width', 50],
                        ['height', 50],
                        ['rotation', 180],
                        ['baseRotation', 180],
                        ['centerImage', true],
                        ['matterBody', null],
                        ['matterBodyType', 'rectangle'],
                        ['matterBodyOffset', { x: 0, y: 0 }],
                        ['matterBodyWidth', 50],
                        ['matterBodyHeight', 50],
                        ['matterBodyOptions', {
                            label: 'item',
                            isSensor: true,
                            collisionFilter: {
                                group: 0,
                                category: this.collisionCategories.itemCategory,
                                mask: this.collisionCategories.playerCategory
                            }
                        }],
                        ['speed', 2],
                        ['moveVector', { x: 0, y: 0 }],
                        ['notPlayer', true],
                        ['sceneOrientedRotation', true],

                    ]
                }).entity;
                break;
            case 'greenBattery':
                id = new CreateEntity({
                    game: this,
                    name: 'greenBattery',
                    components: [
                        ['imgKey', 'greenBattery'],
                        ['pos', pos],
                        ['width', 50],
                        ['height', 50],
                        ['rotation', 180],
                        ['baseRotation', 180],
                        ['centerImage', true],
                        ['matterBody', null],
                        ['matterBodyType', 'rectangle'],
                        ['matterBodyOffset', { x: 0, y: 0 }],
                        ['matterBodyWidth', 50],
                        ['matterBodyHeight', 50],
                        ['matterBodyOptions', {
                            label: 'item',
                            isSensor: true,
                            collisionFilter: {
                                group: 0,
                                category: this.collisionCategories.itemCategory,
                                mask: this.collisionCategories.playerCategory
                            }
                        }],
                        ['speed', 2],
                        ['moveVector', { x: 0, y: 0 }],
                        ['notPlayer', true],
                        ['sceneOrientedRotation', true],

                    ]
                }).entity;
                break;       
            case 'enemy':
                id = new CreateEntity({
                    game:this,
                    name:'enemy',
                    components:[
                        ['imgKey','enemy1'],
                        ['pos',pos],
                        ['width',100],
                        ['height',100],
                        ['rotation',180],
                        ['baseRotation',180],
                        ['centerImage',true],
                        ['matterBody',null],
                        ['matterBodyType','rectangle'],
                        ['matterBodyOffset',{x:0,y:0}],
                        ['matterBodyWidth',100],
                        ['matterBodyHeight',100],
                        ['matterBodyOptions',{
                            label:'enemy',
                            isSensor:true,
                            collisionFilter:{
                                group:0,
                                category:this.collisionCategories.enemyCategory,
                                mask:this.collisionCategories.playerCategory
                            }
                        }],
                        ['speed',2],
                        ['moveVector',{x:0,y:0}],
                        ['notPlayer',true],
                        ['sceneOrientedRotation',true],
                        
                    ]
                }).entity;
                break;
            case 'greenBullet':
                id = new CreateEntity({
                    game:this,
                    name:'greenBullet',
                    components:[
                        ['imgKey','greenBullet'],
                        ['pos',pos],
                        ['width',100],
                        ['height',100],
                        ['rotation',rotation],
                        ['baseRotation',rotation],
                        ['centerImage',true],
                        ['matterBody',null],
                        ['matterBodyType','rectangle'],
                        ['matterBodyOffset',{x:0,y:0}],
                        ['matterBodyWidth',100],
                        ['matterBodyHeight',100],
                        ['matterBodyOptions',{
                            label:'playerBullet',
                            isSensor:true,
                            collisionFilter:{
                                group:0,
                                category:this.collisionCategories.playerBulletCategory,
                                mask:this.collisionCategories.enemyCategory
                            }
                        }],
                        ['speed',2],
                        ['moveVector',{x:0,y:0}],
                        ['notPlayer',true],
                        ['sceneOrientedRotation',true],
                    ]
                }).entity;
                break;
        }
        return id;
    };
    
    
    
}