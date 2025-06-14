import { Mouse } from './mouse.js';
import { Engine as EntityEngine, Simulator as EntitySimulator } from 'jecs';
import { Systems } from './systems.js';
import { Physics } from './physics.js';
import { GameUtils } from './gameUtils.js';
import { StorageManager } from './storageManager.js';
import { SoundManager } from './soundManager.js';
import { Parallax } from './parallax.js';
import { WaveSpawner } from './waveSpawner.js';
import { Player } from './player.js';
import { Ui } from './ui/ui.js';

export class Game {
    constructor(resources) {
        this.resources = resources;
        this.images = resources.imagesData;
        this.entitiesData = resources.entitiesData;
        this.settingsData = resources.settingsData;
        this.audioData = resources.audioData;
        this.enemyWaveData = resources.enemyWaveData;
        this.progressData = resources.progressData;

        this.canvas = document.querySelector('.game-container');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.bgCanvas = document.querySelector('.background-container');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.bgCtx.imageSmoothingEnabled = false;

        this.settingsStorageManager = new StorageManager('settingsStorageManager', this.settingsData);
        this.progressStorageManager =  new StorageManager('progressStorageManager',this.progressData);

        this.soundManager = new SoundManager(this.audioData);

        this.defParallaxSpeed = -0.75;
        this.parallaxSpeed = this.defParallaxSpeed;
        this.backgroundParallax = new Parallax(this.images['background'], this.parallaxSpeed, 'vertical');

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
        this.sceneRotation = this.progressStorageManager.getProperty("sceneRotation") || 0;
        this.nextSceneRotation = 0;
        this.totalSceneRotation = this.progressStorageManager.getProperty("totalSceneRotation") || 0;
        this.isPaused = false;

        this.scenes = [];
        this.currentSceneEntity = null;
        this.sceneEntity = null;
        this.mainMenuSceneEntity = null;
        this.settingsSceneEntity = null;
        this.controlsSceneEntity = null;

        this.debugging = {
            debugMatterBodies: false,
            debugShootDirection: false,
            debugUiClickBox: false,
            debugLocalPos: false
        };

        this.particleEffects = [];

        

        this.mouse = null;
        this.physics = null;
        this.player = null;
        this.ui = null;
        this.gameUtils = null;
        this.enemyWaveSpawner = null;

        this.start();
        this.update();
    };
    start() {
        this.initializeJECS();

        this.gameUtils = new GameUtils(this);
        this.mouse = new Mouse(this);
        this.physics = new Physics(this);
        this.enemyWaveSpawner = new WaveSpawner(this);

        this.initMainMenuSceneEntity();
        this.initSettingsSceneEntity();
        this.initSceneEntity();
        this.initControlsSceneEntity();
        this.initCurrentSceneEntity();

        this.player = new Player(this);
        this.ui = new Ui(this);
        console.log("UI:",this.ui);

        this.onBackgroundCanvasResize();

        this.systemsJECS();

        this.gameUtils.playLoopedMusicOnInteraction('backgroundMusic');

        this.gameUtils.togglePauseForPc();

        this.gameUtils.pauseGame();

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

        this.gameUtils.onHoveredEntityUnActive();
        this.gameUtils.updateParticles();
        this.gameUtils.drawParticles();

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
        systems.destroyOutOfBoundsEntitiesSystem();
    };
    initSceneEntity() {
        this.sceneEntity = this.gameUtils.spawnSceneEntity('sceneEntity', false);
        //console.log("SCENE ENTITY:", this.sceneEntity);
    };
    initMainMenuSceneEntity() {
        this.mainMenuSceneEntity = this.gameUtils.spawnSceneEntity('mainMenuSceneEntity', true);
        //console.log("MAINMENU SCENE ENTITY:", this.mainMenuSceneEntity);
    };
    initSettingsSceneEntity() {
        this.settingsSceneEntity = this.gameUtils.spawnSceneEntity('settingsSceneEntity', false);
        //console.log("SETTINGS SCENE ENTITY:", this.settingsSceneEntity);
    }
    initControlsSceneEntity() {
        this.controlsSceneEntity = this.gameUtils.spawnSceneEntity('controlsSceneEntity', false);
        //console.log("CONTROLS SCENE ENTITY:", this.controlsSceneEntity);
    };
    initCurrentSceneEntity() {
        for (const scene of this.scenes) {
            const isActiveComponent = scene.getComponent('isActive');
            if (isActiveComponent) {
                this.currentSceneEntity = scene;
                break;
            }
        }
    }

}