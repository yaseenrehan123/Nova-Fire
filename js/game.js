import { Mouse } from './mouse.js';
import { Engine as EntityEngine, Simulator as EntitySimulator } from 'jecs';
import { Systems } from './systems.js';
import { Physics } from './physics.js';
import { GameUtils } from './gameUtils.js';
import { CreateEntity } from "./createEntity.js";
import { StorageManager } from './storageManager.js';
import { SoundManager } from './soundManager.js';
import { Parallax } from './parallax.js';
//import { Builder, shapes } from "shape-builder";
//const { Point, Rectangle } = shapes;

export class Game {
    constructor(resources) {
        this.resources = resources;
        this.images = resources.imagesData;
        this.entitiesData = resources.entitiesData;
        this.settingsData = resources.settingsData;
        this.audioData = resources.audioData;


        this.canvas = document.querySelector('.game-container');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.bgCanvas = document.querySelector('.background-container');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.bgCtx.imageSmoothingEnabled = false;

        this.lastTime = 0;
        this.deltaTime = null;
        this.registeredObj = [];
        this.ecs = {
            entityEngine: null,
            entitySim: null,
            systems: new Systems(
                {
                    game: this
                }
            ),
            customSystems: null,
            ecsSystems: null
        };
        this.ecs.customSystems = this.ecs.systems.customSystems;
        this.ecs.ecsSystems = this.ecs.systems.ecsSystems;

        this.matter = {
            matterEngine: null,
            matterRunner: null,
        };
        /*  
        this.shapeBuilder ={
            builder:null
        }
        */
        this.collisionCategories = {
            playerCategory: 0x0001,
            itemCategory: 0x0002,
            playerBulletCategory: 0x0004,
            enemyCategory: 0x0008,
            enemyBulletCategory: 0x0016
        };
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.screenCenterPos = { x: this.width / 2, y: this.height / 2 };
        this.sceneRotation = 0;
        this.nextSceneRotation = 0;
        this.totalSceneRotation = 0;
        this.isPaused = false;

        this.scenes = [];
        this.currentSceneEntity = null;
        this.sceneEntity = null;
        this.mainMenuSceneEntity = null;

        this.debugging = {
            debugMatterBodies: false,
            debugShootDirection: true,
            debugUiClickBox: true,
            debugLocalPos: false
        };

        this.settingsStorageManager = new StorageManager('settingsStorageManager', this.settingsData);
        this.soundManager = new SoundManager(this.audioData);

        this.backgroundParallax = new Parallax(this.images['background'], 1, 'vertical');

        this.mouse = null;
        this.physics = null;
        this.player = null;
        this.ui = null;
        this.gameUtils = null;

        this.start();
        this.update();
    };
    start() {
        this.initializeJECS();

        this.gameUtils = new GameUtils(this);
        this.mouse = new Mouse(this);
        this.physics = new Physics(this)

        this.initMainMenuSceneEntity();
        this.initSceneEntity();
    
        this.onBackgroundCanvasResize();

        this.systemsJECS();

        this.gameUtils.playLoopedMusicOnInteraction('backgroundMusic');
    };
    update(timeStamp) {
        const deltaTime = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;
        this.deltaTime = deltaTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

        this.backgroundParallax.run(this.bgCtx);
        this.ecs.customSystems.drawAllEntities();
        this.ecs.customSystems.debugMatterBodies();
        this.ecs.customSystems.traceMatterBodies();
        this.ecs.customSystems.DebugShootingDirection();
        this.ecs.customSystems.debugBtnClickArea();
        this.ecs.customSystems.handleBtnTriggers();
        this.ecs.customSystems.traceLocalPositions();
        //this.ecs.customSystems.trackPlayerRotation();

        this.registeredObj.forEach((obj) => {
            obj.update();
        });
        //console.log(`Scene Rotation: ${this.sceneRotation}`);
        requestAnimationFrame(this.update.bind(this));
    };
    initializeJECS() {
        this.ecs.entityEngine = new EntityEngine();
        this.ecs.entitySim = new EntitySimulator(this.ecs.entityEngine);
        this.ecs.entitySim.setFps(60);
        this.ecs.entitySim.start();
    };
    onBackgroundCanvasResize() {
        window.addEventListener('resize', () => {
            this.resizeBackgroundCanvas();
        });
        this.resizeBackgroundCanvas();
    }
    resizeBackgroundCanvas() {
        const dpr = window.devicePixelRatio || 1;

        const rect = this.bgCanvas.getBoundingClientRect();

        this.bgCanvas.width = rect.width * dpr;
        this.bgCanvas.height = rect.height * dpr;

        this.bgCtx.scale(dpr, dpr);
    }
    systemsJECS() {
        const systems = this.ecs.ecsSystems;
        systems.changeBodyRotationSystem();
        systems.movePlayerSystem();
        systems.moveEntitiesSystem();
        systems.shootBulletsSystem();
        systems.manageShootEnergySystem();
        systems.playerEnergyBarColorSystem();
        systems.handleLocalPosSystem();
        systems.handleInvincibilityCounterSystem();
    };
    initSceneEntity() {
        this.sceneEntity = this.gameUtils.spawnSceneEntity('sceneEntity',true);
        console.log("SCENE ENTITY:", this.sceneEntity);
    };
    initMainMenuSceneEntity(){
        this.mainMenuSceneEntity = this.gameUtils.spawnSceneEntity('mainMenuSceneEntity',false);
        console.log("MAINMENU SCENE ENTITY:", this.mainMenuSceneEntity);
    }

}