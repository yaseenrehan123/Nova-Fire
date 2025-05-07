import {Mouse} from './mouse.js';
import { CreateEntity } from "./createEntity.js";
import {Engine as EntityEngine,Simulator as EntitySimulator} from 'jecs';
import { Systems } from './systems.js';
import { Physics } from './physics.js';
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
            debugBodies:true
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
        this.totalSceneRotation = 0;

        this.mouse = new Mouse(this);
        this.physics = new Physics(this)
        this.start();
        this.update();
    };
    start(){
        this.initializeJECS();

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
        this.ecs.customSystems.traceMatterBodies();
        
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

    };
    rotateOffset(offset, angleDegrees) {
        const rad = angleDegrees * Math.PI / 180;
        return {
            x: offset.x * Math.cos(rad) - offset.y * Math.sin(rad),
            y: offset.x * Math.sin(rad) + offset.y * Math.cos(rad)
        };
    }
    deepMerge(target, source) {
        for (const key in source) {
            if (
                typeof source[key] === 'object' &&
                source[key] !== null &&
                !Array.isArray(source[key])
            ) {
                if (!target[key]) target[key] = {};
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
    
}