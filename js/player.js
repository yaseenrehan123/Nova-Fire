export class Player{
    constructor(game){
        this.game = game;
        this.canvas = game.canvas;
        this.playerEntity = null;
        this.maxHealth = 0;
        this.currentHealth = 0;
        this.isFireHeld = false;
        this.init();
    }
    init(){
        console.log("Game instance from player!" ,this.game)
        console.log("Game Center pos " ,this.game.screenCenterPos)
        this.playerEntity = this.game.spawnEntity({
            passedKey:'player',
            componentsToModify:{
                pos:{
                    x:this.game.screenCenterPos.x,
                    y:this.game.screenCenterPos.y
                },
                matterBodyOptions:{
                    label: "player",
                    isSensor: true,
                    collisionFilter:{
                        group:0,
                        category:this.game.collisionCategories.playerCategory,
                        mask:this.game.collisionCategories.itemCategory | this.game.collisionCategories.enemyCategory
                    }
                }
            }
        });

        this.maxHealth = this.playerEntity.getComponent('health');// set maxhealth

        //console.log("Player",this.playerEntity);
        const activeEvents = ['touchstart','touchmove','mousedown']
        const deActiveEvents = ['touchend','mouseup'];
        
        activeEvents.forEach((eventName)=>{
            this.canvas.addEventListener(eventName,()=>{
                this.isFireHeld = true;
                const shootEnergyComponent = this.playerEntity.getComponent('shootEnergy');
                if(shootEnergyComponent.isDepleted) return;
                this.playerEntity.getComponent('shootBullet').active = true;
            },{passive:true});
        });
        deActiveEvents.forEach((eventName)=>{
            this.canvas.addEventListener(eventName,()=>{
                this.isFireHeld = false;
                this.playerEntity.getComponent('shootBullet').active = false;
            },{passive:true})
        })
    };
}