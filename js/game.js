import {Mouse} from './mouse.js';
import { CreateEntity } from "./createEntity.js";
import {Engine as EntityEngine,Simulator as EntitySimulator} from 'jecs';
import {Engine as MatterEngine,Runner as MatterRunner,Events, Body} from 'matter-js'
import { Systems } from './systems.js';
//import { Builder, shapes } from "shape-builder";
//const { Point, Rectangle } = shapes;

export class Game{
    constructor(resources){
        this.resources = resources;
        this.images = resources.imagesData;
        this.entitiesData = resources.entitiesData;
        
        this.canvas = document.querySelector('.game-container');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.lastTime = 0;
        this.deltaTime = null;
        this.registeredObj = [];
        this.ecs = {
            entityEngine: null,
            entitySim: null,
            systems: new Systems(
                {
                    game:this
                }
            ),
            customSystems: null,
            ecsSystems: null
        };
        this.ecs.customSystems = this.ecs.systems.customSystems;
        this.ecs.ecsSystems = this.ecs.systems.ecsSystems;

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
        this.nextSceneRotation = 0;
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

    };
    update(timeStamp){
        const deltaTime = (timeStamp - this.lastTime)/1000;
        this.lastTime = timeStamp;
        this.deltaTime = deltaTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.shapeBuilder.builder.removeShapes();

        this.ecs.customSystems.drawSprites()
        this.ecs.customSystems.debugMatterBodies();
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
        const systems = this.ecs.ecsSystems;
        systems.changeBodyRotationSystem();
        systems.movePlayerSystem();
        systems.moveEntitiesSystem();
        systems.shootBulletsSystem();
    };
  
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
   
    
    spawnEntity(options){
        const{
            passedKey= '',
            componentsToModify = {}
        } = options;
        let id = null;

        const entityDataKeys = Object.keys(this.entitiesData);
        let reqData = null;

        entityDataKeys.forEach((key)=>{
            if(key === passedKey){
                reqData = this.entitiesData[key];
            }
        })

        if(!reqData){
            throw new Error(`Requested data not found in entitiesData: ${passedKey}`);
        }

        const components = reqData.components;
        for(const key in componentsToModify){
            if(components.hasOwnProperty(key)){
                components[key] = componentsToModify[key];
            }
        }
        console.log("Modified Components:",components);

        id = new CreateEntity({
            game:this,
            name:passedKey,
            components:components
        }).entity;
        
        return id;
/*
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
                    name:'enemy1',
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
                */
        
    };
    
    
    
}