export class Player {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.playerEntity = null;
        this.maxHealth = 0;
        this.currentHealth = 0;
        this.isFireHeld = false;
        this.init();
    }
    init() {
        //console.log("Game instance from player!" ,this.game)
        //console.log("Game Center pos " ,this.game.screenCenterPos)
        this.playerEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'player',
            componentsToModify: {
                pos: {
                    x: this.game.screenCenterPos.x,
                    y: this.game.screenCenterPos.y
                },
                matterBodyOptions: {
                    label: "player",
                    collisionFilter: {
                        category: this.game.collisionCategories.playerCategory,
                        mask: this.game.collisionCategories.itemCategory | this.game.collisionCategories.enemyCategory
                    }
                },
                health: this.game.progressStorageManager.getProperty("playerHealth") || 50,
                shootBullet: {
                    spawnKey: this.game.progressStorageManager.getProperty("playerBulletType") || "greenBullet",
                },
                shootTimes: this.game.progressStorageManager.getProperty("playerBulletPower") || 1
            }
        });

        //this.game.assignParent(this.playerEntity,this.game.sceneEntity);

        this.maxHealth = 50;// set maxhealth
        console.log(this.maxHealth);
        console.log(this.playerEntity.getComponent('health'));
        //console.log("Player",this.playerEntity);
        const activeEvents = ['touchstart', 'touchmove', 'mousedown']
        const deActiveEvents = ['touchend', 'mouseup'];

        activeEvents.forEach((eventName) => {
            this.canvas.addEventListener(eventName, () => {
                this.isFireHeld = true;
                const shootEnergyComponent = this.playerEntity.getComponent('shootEnergy');
                if (shootEnergyComponent.isDepleted) return;
                this.playerEntity.getComponent('shootBullet').active = true;
            }, { passive: true });
        });
        deActiveEvents.forEach((eventName) => {
            this.canvas.addEventListener(eventName, () => {
                this.isFireHeld = false;
                this.playerEntity.getComponent('shootBullet').active = false;
            }, { passive: true })
        })
    };
}