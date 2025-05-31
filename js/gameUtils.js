import merge from 'lodash.merge';
import { World } from 'matter-js';
import { CreateEntity } from "./createEntity.js";
export class GameUtils {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
    };
    addObj(obj) {
        this.game.registeredObj.push(obj);
    };
    drawImage({
        img,
        pos = { x: 0, y: 0 },
        width,
        height,
        centerImage = true,
        rotation = 0,
        shouldBlink = false
    }) {
        const ctx = this.ctx;
        // local offsets
        const offsetX = centerImage ? -width / 2 : 0;
        const offsetY = centerImage ? -height / 2 : 0;


        ctx.save();

        ctx.globalAlpha = shouldBlink ? 0 : 1;

        // 1) move origin to sprite pos
        ctx.translate(pos.x, pos.y);
        // 2) rotate around that origin
        //console.log(rotation)
        ctx.rotate((rotation) * Math.PI / 180);
        // 3) draw relative to (0,0) — offset so your image is centered if desired
        ctx.drawImage(img, offsetX, offsetY, width, height);
        ctx.restore();
        //console.log(`rotation passed in drawImage ${rotation}`)
    };
    spawnEntity(options) {
        const {
            passedKey = '',
            componentsToModify = {}
        } = options;
        let id = null;

        const entityDataKeys = Object.keys(this.game.entitiesData);
        let reqData = null;

        entityDataKeys.forEach((key) => {
            if (key === passedKey) {
                reqData = this.game.entitiesData[key];
            }
        })

        if (!reqData) {
            throw new Error(`Requested data not found in entitiesData: ${passedKey}`);
        }

        const originalComponents = reqData.components;
        const modifiedComponents = merge({}, originalComponents, componentsToModify);
        //console.log("Modified Components:",components);

        id = new CreateEntity({
            game: this.game,
            name: passedKey,
            components: modifiedComponents
        }).entity;

        if (id.hasComponent('parent')) {
            const defaultParentEntity = this.game.sceneEntity;
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
    changeShootBullet(options) {
        const {
            entity = null,
            changeSpawnKeyComponent = null,

        } = options;

        const shootComponent = entity.getComponent('shootBullet');
        shootComponent.spawnKey = changeSpawnKeyComponent;
        entity.setComponent('shootBullet', shootComponent);
    }
    changeShootDelay(options) {
        const {
            entity = null,
            changeDelayComponent = null,
        } = options

        const shootComponent = entity.getComponent('shootBullet');
        shootComponent.delayInSeconds = changeDelayComponent;
        entity.setComponent('shootBullet', shootComponent);
    }
    changeShootTimes(options) {
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

        if (effect === 'increase') {
            newShootTimes += value;
        }
        else if (effect === 'decrease') {
            newShootTimes -= value;
        }
        //console.log(newShootTimes);
        entity.setComponent('shootTimes', newShootTimes);
    }
    damageEntity(options) {
        const {
            entity = null,
            damageComponent = null
        } = options;

        const invincibilityComponent = entity.getComponent('invincibility');
        if (invincibilityComponent && invincibilityComponent.active) {
            return;
        }
        const healthComponent = entity.getComponent('health');

        let newHealth = healthComponent;

        newHealth -= damageComponent;

        entity.setComponent('health', newHealth);

        this.onHealthEmpty({
            entity: entity,
            health: newHealth
        })

        //console.log('healthComponent new health:',newHealth);
    }
    onHealthEmpty(options) {
        const {
            entity = null,
            health = 0,
        } = options

        if (health <= 0) {
            this.removeEntity(entity)
        }
    }
    removeEntity(entity) {
        const matterBody = entity.getComponent('matterBody');
        if (matterBody) {
            World.remove(this.game.matter.matterEngine.world, matterBody);
        }
        const name = entity.name;
        this.game.ecs.entityEngine.removeEntity(name);
    };
    lerp(a, b, t) {
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
    returnIsPaused() {
        return this.game.isPaused;
    }
    pauseGame() {
        this.game.isPaused = true;
        this.game.ecs.entitySim.pause();
        this.game.matter.matterRunner.enabled = false;
        console.log("IS SIMULATION PAUSED?", this.game.ecs.entitySim.isPaused());
    };
    unPauseGame() {
        this.game.isPaused = false;
        this.game.ecs.entitySim.start();
        this.game.matter.matterRunner.enabled = true;
        console.log("IS SIMULATION RUNNING?", this.game.ecs.entitySim.isRunning());
    }
    queryAllComponents(e, reqComponents, callback) {
        if (!reqComponents.every(c => e.hasComponent(c))) return;
        callback(e);
    }
    filterEntitiesByComponents(reqComponents, callback) {
        const entities = Object.values(this.game.ecs.entityEngine.entities);

        //console.log("ENTITIES:",entities);
        for (const e of entities) {
            this.queryAllComponents(e, reqComponents, callback);
        };
    };
    setBarValue(options) {
        const {
            max = 0,
            current = 0,
            barEntity = null
        } = options;

        const newValue = current / max;// gives value between 0 and 1

        const barComponent = barEntity.getComponent('bar');
        const flashEffectEnabled = barComponent.flashEffect.enabled;
        //console.log("FLASH EFFECT ENABLED:",flashEffectEnabled);
        if (flashEffectEnabled) {
            barComponent.flashEffect.prevValue = barComponent.flashEffect.value;
            barComponent.flashEffect.targetValue = newValue;
        };
        barComponent.value = newValue;

        barEntity.setComponent('bar', barComponent);
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
    setIsActive(entity, bool) {
        let isActive = entity.getComponent('isActive');
        if (isActive === null) return;
        isActive = bool;
        entity.setComponent('isActive', isActive);
    };
    anchorEntity(anchoredEntity, parentEntity) {
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

        const anchoredPosX = this.anchoringHorizontal(parentX, parentW, anchoringX);
        const anchoredPosY = this.anchoringVertical(parentY, parentH, anchoringY);

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

        if (posComponent) {
            anchoredEntity.setComponent('pos', anchoredPos);
        }
    };

    calculateTextWidthAndHeight(textEntity) {
        const ctx = this.ctx;

        const size = textEntity.getComponent('fontSize');
        const style = textEntity.getComponent('fontStyle');
        const content = textEntity.getComponent('fontContent');

        ctx.font = `${size}px ${style}`;

        const textMetrics = ctx.measureText(content);
        const textWidth = textMetrics.width;
        const textHeight = size;

        textEntity.setComponent('width', textWidth);
        textEntity.setComponent('height', textHeight);
    };
    isMouseOver(x, y, w, h) {
        const mouse = this.game.mouse;
        const mouseX = mouse.pos.x;
        const mouseY = mouse.pos.y;
        return (
            mouseX >= x &&
            mouseX <= x + w &&
            mouseY >= y &&
            mouseY <= y + h
        );
    };
    assignParent(childEntity, parentEntity) {
        let childEntityParentComponent = childEntity.getComponent('parent');// an obj/entity ref
        let parentEntityChildrenComponent = parentEntity.getComponent('children');// an array

        if (parentEntityChildrenComponent.includes(childEntityParentComponent)) return;

        childEntityParentComponent = parentEntity;
        //console.log("CHILD ENTITY PARENT COMPONENT:",childEntityParentComponent);
        parentEntityChildrenComponent.push(childEntity);

        childEntity.setComponent('parent', childEntityParentComponent);
        parentEntity.setComponent('children', parentEntityChildrenComponent);

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
    };
    getGlobalFromLocalPos(entity) {
        let pos = { x: 0, y: 0 };

        const localPos = entity.getComponent('localPos');
        const parent = entity.getComponent('parent');

        const parentPos = parent.getComponent('pos');

        if (localPos && parentPos) {
            pos = {
                x: localPos.x + parentPos.x,
                y: localPos.y + parentPos.y
            };
        };
        return pos;
    };
    toggleCheckbox(entity) {
        const checkboxComponent = entity.getComponent('checkbox');
        if (!checkboxComponent) return;

        checkboxComponent.state = !checkboxComponent.state;

        entity.setComponent('checkbox', checkboxComponent);

        return checkboxComponent.state;
    };
    retrieveSavedCheckboxData(entity, storageManager) {
        const checkboxComponent = entity.getComponent('checkbox');
        const propertyKey = checkboxComponent.storageKey;
        const savedProperty = storageManager.getProperty(propertyKey);

        checkboxComponent.state = savedProperty;

        entity.setComponent('checkbox', checkboxComponent);
    };
    returnCheckboxStorageKey(entity) {
        const checkboxComponent = entity.getComponent('checkbox');
        return checkboxComponent.storageKey;
    };
    setFontContent(entity, newContent) {
        entity.setComponent('fontContent', newContent)
    };
    toggleFontContentOnCheckbox(checkboxEntity, textEntity, onToggledTrueText, onToggledFalseText) {
        const checkboxComponent = checkboxEntity.getComponent('checkbox');
        const state = checkboxComponent.state;

        if (state) {
            this.setFontContent(textEntity, onToggledTrueText);
        }
        else {
            this.setFontContent(textEntity, onToggledFalseText);
        }
    };
    playPlayerShootSound() {
        const shootBulletComponent = this.game.player.playerEntity.getComponent('shootBullet');
        const fireType = shootBulletComponent.spawnKey;
        let soundKey = '';

        switch (fireType) {
            case 'greenBullet':
                soundKey = 'greenBulletShoot';
                break;

            case 'blueBullet':
                soundKey = 'blueBulletShoot';
                break;

            case 'purpleBullet':
                soundKey = 'purpleBulletShoot';
                break;

            case 'yellowBullet':
                soundKey = 'yellowBulletShoot';
                break;

            default:
                soundKey = ''
                break;

        };
        if (soundKey !== '')
            this.playSfx(soundKey);
    };
    playSfx(key) {
        console.log('SFX enabled?', this.game.settingsData.sfx);
        if (!this.game.settingsStorageManager.getProperty('sfx')) return;
        this.game.soundManager.play(key);
    };
    playLoopedMusic(key) {
        if (!this.game.settingsStorageManager.getProperty('music')) return;
        this.game.soundManager.loop(key);
    };
    playLoopedMusicOnInteraction(key) {
        const playMusicOnInteraction = () => {
            this.playLoopedMusic(key);

            window.removeEventListener('click', playMusicOnInteraction);
            window.removeEventListener('keydown', playMusicOnInteraction);
        };

        window.addEventListener('click', playMusicOnInteraction);
        window.addEventListener('keydown', playMusicOnInteraction);
    };
    activateInvincibility(entity) {
        const invincibilityComponent = entity.getComponent('invincibility');
        invincibilityComponent.active = true;
        invincibilityComponent.invincibilityCounter = invincibilityComponent.invincibilityDuration;
        entity.setComponent("invincibility", invincibilityComponent);
    };
    isInvincibilityActive(entity) {
        const invincibilityComponent = entity.getComponent('invincibility');
        return invincibilityComponent.active;
    };
    spawnSceneEntity(name,isActive){
         const sceneEntity = new CreateEntity({
            game: this.game,
            name: name,
            components: {
                pos: { x: 0, y: 0 },
                width: this.game.width,
                height: this.game.height,
                isActive: isActive,
                children: []
            }
        }).entity;

        this.game.scenes.push(sceneEntity);

        return sceneEntity;
    };
    loadScene(sceneToSwitch){
        const scenes = this.game.scenes;
        scenes.forEach((sceneEntity)=>{
            sceneEntity.setComponent('isActive',false);
        });
        sceneToSwitch.setComponent('isActive',true);
        this.game.currentSceneEntity = sceneToSwitch;
    };
    reloadScene(){

    };

};