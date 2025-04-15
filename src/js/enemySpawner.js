import { Enemy1,Enemy2,Enemy3 } from "./enemyTypes.js";
export class EnemySpawner{
    constructor(gameSettings){
        this.gameSettings = gameSettings;
        this.spawnDelayInSeconds = 3;
        this.counter = this.spawnDelayInSeconds;
        this.spawnTimes = 1;
        this.enemies = [Enemy1,Enemy2,Enemy3];
        this.start();
    };
    start(){
        this.gameSettings.registerObject(this);
    };
    update(deltaTime){
        this.subtractCounter(deltaTime);
        this.spawnEnemies();
    };
    spawnEnemies() {
        if(this.counter > 0)
            return;
        for (let i = 0; i < this.spawnTimes; i++) {
            const EnemyClass = this.pickRandomEnemy();
            const rotation = this.gameSettings.sceneRotation;
            let position = { x: 0, y: 0 };
    
            const screenW = this.gameSettings.windowWidth;
            const screenH = this.gameSettings.windowHeight;
    
            if (rotation === 0) {
                // Spawn at top
                position.x = Math.random() * screenW;
                position.y = -50; // Just above screen
            } else if (rotation === 90) {
                // Spawn at right
                position.x = screenW + 50;
                position.y = Math.random() * screenH;
            } else if (rotation === 180) {
                // Spawn at bottom
                position.x = Math.random() * screenW;
                position.y = screenH + 50;
            } else if (rotation === -90 || rotation === 270) {
                // Spawn at left
                position.x = -50;
                position.y = Math.random() * screenH;
            } else {
                // Fallback (defaults to top)
                position.x = Math.random() * screenW;
                position.y = -50;
            }

            const enemyClass = this.pickRandomEnemy();
            const enemy = new enemyClass(this.gameSettings,position);
            this.resetCounter();
        };
    };
    pickRandomEnemy(){
        const index = Math.floor(Math.random() * this.enemies.length);
        return this.enemies[index];
    };
    subtractCounter(deltaTime){
        if (this.counter > 0){
            this.counter -= deltaTime;
        };
    };
    resetCounter(){
        this.counter = this.spawnDelayInSeconds;
    };
};