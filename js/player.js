export class Player{
    constructor(options){
        const{
            game=null,
        } = options;
        this.game = game;
        this.canvas = game.canvas;
        this.playerEntity = null;

        this.init();
    }
    init(){
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
        //console.log("Player",this.playerEntity);
        const activeEvents = ['touchstart','touchmove','mousedown']
        const deActiveEvents = ['touchend','mouseup'];
        
        activeEvents.forEach((eventName)=>{
            this.canvas.addEventListener(eventName,()=>{
                this.playerEntity.getComponent('shootBullet').active = true;
            },{passive:true});
        });
        deActiveEvents.forEach((eventName)=>{
            this.canvas.addEventListener(eventName,()=>{
                this.playerEntity.getComponent('shootBullet').active = false;
            },{passive:true})
        })
    }
}