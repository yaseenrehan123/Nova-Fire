import { ChangeView } from "./changeview.js";
export class WaveSpawner {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;
        this.data = game.enemyWaveData;
        console.log("GameUtils:", this.gameUtils)
        this.isSpawning = false;
        this.waveJustBegan = false;
        this.currentWaveIndex = game.progressStorageManager.getProperty("waveIndex") || 0;
        this.delayBetweenWaves = 2;//seconds
        this.spawnedEnemies = [];

        this.start();
    };
    start() {
        this.game.gameUtils.addObj(this);
    };
    update() {
        //console.log("WAVE JUST BEGAN:", this.waveJustBegan);
        if (this.waveJustBegan) {
            // Do nothing here; let other systems act on it for this frame
            this._resetWaveFlagNextFrame();
        };
    };
    async startWaves() {
        this.isSpawning = true;

        if (!this.isSpawning) return;

        while (this.currentWaveIndex < this.data.length) {
            const wave = this.data[this.currentWaveIndex];
            this.spawnedEnemies = [];
            this.waveJustBegan = true;

            console.log(`Spawning wave ${this.currentWaveIndex}`);

            for (const step of wave) {
                while (this.game.isPaused) {
                    await this._delay(0.2);
                }

                await this._delay(step.delay || 0);

                if (step.type === "enemy") {
                    this.spawnEnemy(step.key,step.pos || null);
                }

                if (step.type === "rotation") {
                    if (step.newRotation !== undefined) {
                        new ChangeView({ game: this.game, newRotation: step.newRotation });
                        console.log("ROTATION CHANGE ENCOUNTERED:", step.newRotation, this.game.sceneRotation, this.game.totalSceneRotation);
                    }
                }

                // Future types can go here
            }

            // Wait until all enemies from this wave are dead
            while (this.areWaveEnemiesAlive()) {
                await this._delay(0.2);
            }

            this.currentWaveIndex++;
            this.game.progressStorageManager.setProperty("waveIndex", this.currentWaveIndex);
            this.game.progressStorageManager.setProperty("sceneRotation", this.game.sceneRotation);
            this.game.progressStorageManager.setProperty("totalSceneRotation", this.game.totalSceneRotation);
            const playerEntity = this.game.player.playerEntity;
            this.game.progressStorageManager.setProperty
                ("playerBulletType", playerEntity.getComponent("shootBullet").spawnKey)
            this.game.progressStorageManager.setProperty("playerBulletPower", playerEntity.getComponent("shootTimes"));
            this.game.progressStorageManager.setProperty("playerHealth", playerEntity.getComponent("health"));
        }

        this.isSpawning = false;
        this.gameUtils.gamewon();
        console.log("All waves finished.");
    }


    spawnEnemy(enemyKey, customPos = null) {
        const rotation = this.game.totalSceneRotation;
        const spawnPos = customPos || this.getSpawnPosition(rotation);

        const enemy = this.gameUtils.spawnEntity({
            passedKey: enemyKey,
            componentsToModify: {
                pos: spawnPos,
                rotation: 180 + this.game.totalSceneRotation,
                baseRotation: 180,
                matterBodyOptions: {
                    label: "enemy",
                    collisionFilter: {
                        category: this.game.collisionCategories.enemyCategory,
                        mask: this.game.collisionCategories.playerCategory |
                            this.game.collisionCategories.playerBulletCategory
                    }
                }
            }
        });
        this.spawnedEnemies.push(enemy);
    }


    getSpawnPosition(rotationDegrees) {
        const angle = (rotationDegrees - 90) * (Math.PI / 180);
        const canvasWidth = this.game.width;
        const canvasHeight = this.game.height;
        const buffer = 100; // Adjustable buffer distance from screen edge

        // Center of screen
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        // Unit direction vector
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        // Start at screen edge (not diagonal circle)
        let spawnX = centerX;
        let spawnY = centerY;

        // Extend in direction until it reaches an edge + buffer
        if (Math.abs(dx) > Math.abs(dy)) {
            // Coming from left or right
            spawnX += (dx > 0 ? (canvasWidth / 2 + buffer) : -(canvasWidth / 2 + buffer));
            spawnY += dy / Math.abs(dx) * (canvasWidth / 2 + buffer);
        } else {
            // Coming from top or bottom
            spawnY += (dy > 0 ? (canvasHeight / 2 + buffer) : -(canvasHeight / 2 + buffer));
            spawnX += dx / Math.abs(dy) * (canvasHeight / 2 + buffer);
        }

        // Spread: random offset perpendicular to movement direction
        const perpX = -dy;
        const perpY = dx;
        const spreadWidth = (Math.abs(perpX) * canvasWidth) + (Math.abs(perpY) * canvasHeight);
        const offset = (Math.random() - 0.5) * spreadWidth;
        const offsetX = perpX * offset;
        const offsetY = perpY * offset;

        return {
            x: spawnX + offsetX,
            y: spawnY + offsetY
        };
    }
    _delay(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    _resetWaveFlagNextFrame() {
        // Set false in the next frame
        setTimeout(() => {
            this.waveJustBegan = false;
        }, 0); // effectively next JS tick/frame
    }
    areWaveEnemiesAlive() {
        return this.spawnedEnemies.some(e => this.gameUtils.entityExists(e));
    }


}