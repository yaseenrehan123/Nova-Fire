import {Mouse} from './mouse.js';
import { CreateEntity } from "./createEntity.js";
import {Engine as EntityEngine,Simulator as EntitySimulator} from 'jecs';
import { World } from 'matter-js';
import { Systems } from './systems.js';
import { Physics } from './physics.js';
import merge from 'lodash.merge';
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
            enemyCategory:0x0008,
            enemyBulletCategory:0x0016
        };
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.screenCenterPos = {x:this.width/2,y:this.height/2};
        this.sceneRotation = 0;
        this.nextSceneRotation = 0;
        this.totalSceneRotation = 0;
        this.isPaused = false;
        this.sceneEntity = null;
        this.debugging = {
            debugMatterBodies:false,
            debugShootDirection:true,
            debugUiClickBox:true
        };
        this.mouse = null;
        this.physics = null;
        this.player = null;
        this.ui = null;
        
        this.start();
        this.update();
    };
    start(){
        this.initializeJECS();
        this.initSceneEntity();

        this.onResize();
        
        this.systemsJECS();

        this.mouse = new Mouse(this);
        this.physics = new Physics(this)

    };
    update(timeStamp){
        const deltaTime = (timeStamp - this.lastTime)/1000;
        this.lastTime = timeStamp;
        this.deltaTime = deltaTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ecs.customSystems.drawAllEntities();
        this.ecs.customSystems.debugMatterBodies();
        this.ecs.customSystems.traceMatterBodies();
        this.ecs.customSystems.DebugShootingDirection();
        this.ecs.customSystems.debugBtnClickArea();
        this.ecs.customSystems.handleBtnTriggers();
        //this.ecs.customSystems.trackPlayerRotation();

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
        systems.manageShootEnergySystem();
        systems.playerEnergyBarColorSystem();
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

        const originalComponents = reqData.components;
        const modifiedComponents = merge({},originalComponents,componentsToModify);
        //console.log("Modified Components:",components);

        id = new CreateEntity({
            game:this,
            name:passedKey,
            components:modifiedComponents
        }).entity;
        
        if (id.hasComponent('parent')) {
            const defaultParentEntity = this.sceneEntity;
            const idParentComponent = id.getComponent('parent');//get the refrence

            if (!idParentComponent) {// if no parent is assigned than by default,make it sceneEntity
                this.assignParent(id, defaultParentEntity);
            } else {
                this.assignParent(id, idParentComponent);
            }
        }
        
        return id;

    };
    rotateOffset(offset, angleDegrees) {
        const rad = angleDegrees * Math.PI / 180;
        return {
            x: offset.x * Math.cos(rad) - offset.y * Math.sin(rad),
            y: offset.x * Math.sin(rad) + offset.y * Math.cos(rad)
        };
    }
    changeShootBullet(options){
        const {
            entity = null,
            changeSpawnKeyComponent = null,

        } = options;
        
        const shootComponent = entity.getComponent('shootBullet');
        shootComponent.spawnKey = changeSpawnKeyComponent;
        entity.setComponent('shootBullet',shootComponent);
    }
    changeShootDelay(options){
        const {
            entity = null,
            changeDelayComponent = null,
        } = options
        
        const shootComponent = entity.getComponent('shootBullet');
        shootComponent.delayInSeconds = changeDelayComponent;
        entity.setComponent('shootBullet',shootComponent);
    }
    changeShootTimes(options){
        const {
            entity = null,
            changeShootTimesComponent = null,
        } = options
        //console.log("Change ShootTimes Function Called");

        const shootTimesComponent = entity.getComponent('shootTimes');
        const value = changeShootTimesComponent.value;
        //console.log("Value",value);
        const effect = changeShootTimesComponent.changeEffect;
        //console.log("ShootTimesComponentBeforeChange:",shootTimesComponent)
        let newShootTimes = shootTimesComponent;

        if(effect === 'increase'){
            newShootTimes += value;
        }
        else if(effect === 'decrease'){
            newShootTimes -= value;
        }
        //console.log(newShootTimes);
        entity.setComponent('shootTimes',newShootTimes);
    }
    damageEntity(options){
        const {
            entity = null,
            damageComponent = null
        } = options;

        const healthComponent = entity.getComponent('health');

        let newHealth = healthComponent;

        newHealth -= damageComponent;
        
        entity.setComponent('health',newHealth);

        this.onHealthEmpty({
            entity:entity,
            health:newHealth
        })

        //console.log('healthComponent new health:',newHealth);
    }
    onHealthEmpty(options){
        const {
            entity = null,
            health = 0,
        } = options

        if(health <= 0){
            this.removeEntity(entity)
        }
    }
    removeEntity(entity){
        const matterBody = entity.getComponent('matterBody');
        if(matterBody){
            World.remove(this.matter.matterEngine.world,matterBody);
        }
        const name = entity.name;
        this.ecs.entityEngine.removeEntity(name);
    };
    lerp(a,b,t){
        if (
        typeof a !== 'number' || isNaN(a) ||
        typeof b !== 'number' || isNaN(b) ||
        typeof t !== 'number' || isNaN(t)
    ) {
        console.warn("NaN in lerp input:", { a, b, t });
        return 0;
    }
    return a + (b - a) * t;
    };
    returnIsPaused(){
        return this.isPaused;
    }
    pauseGame(){
        this.isPaused = true;
        this.ecs.entitySim.pause();
    };
    queryAllComponents(e,reqComponents,callback){
        if(!reqComponents.every(c => e.hasComponent(c)))return;
        callback(e);
    }
    filterEntitiesByComponents(reqComponents,callback){
        const entities = Object.values(this.ecs.entityEngine.entities);

        //console.log("ENTITIES:",entities);
        for(const e of entities){
            this.queryAllComponents(e, reqComponents, callback);
        };
    };
    setBarValue(options){
        const {
            max = 0,
            current = 0,
            barEntity = null
        } = options;

        const newValue = current / max;// gives value between 0 and 1

        const barComponent = barEntity.getComponent('bar');
        const flashEffectEnabled = barComponent.flashEffect.enabled;
        //console.log("FLASH EFFECT ENABLED:",flashEffectEnabled);
        if(flashEffectEnabled){
            barComponent.flashEffect.prevValue = barComponent.flashEffect.value;
            barComponent.flashEffect.targetValue = newValue;
        };
        barComponent.value = newValue;

        barEntity.setComponent('bar',barComponent);
    };
    anchoringHorizontal(parentX, parentW, anchorX) {
        let posX = null;
        if (anchorX === 'left') {
            posX = parentX;
        }
        else if (anchorX === 'center') {
            posX = parentX + parentW / 2;
        }
        else if (anchorX === 'right') {
            posX = parentX + parentW;
        };
        return posX;
    };
    anchoringVertical(parentY, parentH, anchorY) {
        let posY = null;
        if (anchorY === 'top') {
            posY = parentY;
        }
        else if (anchorY === 'middle') {
            posY = parentY + parentH / 2;
        }
        else if (anchorY === 'bottom') {
            posY = parentY + parentH;
        };
        return posY;
    };
    setIsActive(entity,bool){
        let isActive = entity.getComponent('isActive');
        if(isActive === null) return;
        isActive = bool;
        entity.setComponent('isActive',isActive);
    };
    anchorEntity(anchoredEntity,parentEntity) {
        const posComponent = anchoredEntity.getComponent('pos');
        const anchoringComponent = anchoredEntity.getComponent('anchoring');
        const widthComponent = anchoredEntity.getComponent('width');
        const heightComponent = anchoredEntity.getComponent('height');
        const isText = anchoredEntity.hasComponent('fontContent');

        const anchoringX = anchoringComponent.anchorX;
        const anchoringY = anchoringComponent.anchorY;
        const manualOffsetX = anchoringComponent.offsetX;
        const manualOffsetY = anchoringComponent.offsetY;

        const parentPosComponent = parentEntity.getComponent('pos');
        const parentWidthComponent = parentEntity.getComponent('width');
        const parentHeightComponent = parentEntity.getComponent('height');
        const parentX = parentPosComponent.x;
        const parentY = parentPosComponent.y;
        const parentW = parentWidthComponent;
        const parentH = parentHeightComponent;

        const anchoredPosX = this.anchoringHorizontal(parentX,parentW,anchoringX);
        const anchoredPosY = this.anchoringVertical(parentY,parentH,anchoringY);

        let offsetX = 0;
        let offsetY = 0;

        if (!isText) {
            offsetX = 0;
            if (anchoringX === 'left') offsetX = 0;
            else if (anchoringX === 'center') offsetX = widthComponent / 2;
            else if (anchoringX === 'right') offsetX = widthComponent;

            offsetY = 0;
            if (anchoringY === 'top') offsetY = 0;
            else if (anchoringY === 'middle') offsetY = heightComponent / 2;
            else if (anchoringY === 'bottom') offsetY = heightComponent;
        }
       

        const anchoredPos = {
            x: anchoredPosX - offsetX + manualOffsetX,
            y: anchoredPosY - offsetY + manualOffsetY
        }

        if(posComponent){
            anchoredEntity.setComponent('pos',anchoredPos);
        }
    };
    initSceneEntity(){
        this.sceneEntity = new CreateEntity({
            game:this,
            name:'SceneEntity',
            components:{
                pos:{x:0,y:0},
                width:this.width,
                height:this.height,
                isActive:true,
                children:[]
            }
        }).entity;
        console.log("SCENE ENTITY:",this.sceneEntity);
    };
    calculateTextWidthAndHeight(textEntity){
        const ctx = this.ctx;

        const size = textEntity.getComponent('fontSize');
        const style = textEntity.getComponent('fontStyle');
        const content = textEntity.getComponent('fontContent');

        ctx.font = `${size}px ${style}`;

        const textMetrics = ctx.measureText(content);
        const textWidth = textMetrics.width;
        const textHeight = size;

        textEntity.setComponent('width',textWidth);
        textEntity.setComponent('height',textHeight);
    };
    isMouseOver(x,y,w,h) {
        const mouseX = this.mouse.pos.x;
        const mouseY = this.mouse.pos.y;
        return (
            mouseX >= x &&
            mouseX <= x + w &&
            mouseY >= y &&
            mouseY <= y + h
        );
    };
    assignParent(childEntity,parentEntity){
        let childEntityParentComponent = childEntity.getComponent('parent');// an obj/entity ref
        let parentEntityChildrenComponent = parentEntity.getComponent('children');// an array

        if(parentEntityChildrenComponent.includes(childEntityParentComponent)) return;

        childEntityParentComponent = parentEntity;
        //console.log("CHILD ENTITY PARENT COMPONENT:",childEntityParentComponent);
        parentEntityChildrenComponent.push(childEntity);

        childEntity.setComponent('parent',childEntityParentComponent);
        parentEntity.setComponent('children',parentEntityChildrenComponent);

        //console.log("CHILD ENTITY PARENT COMPONENT AFTER SET:",childEntity.getComponent('parent'));
    };
    isEntityActive(entity) {
        let current = entity;

        while (current) {
            const isActive = current.getComponent('isActive');
            if (!isActive) return false;

            current = current.getComponent('parent');
        }

        return true;
    }

}