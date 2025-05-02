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
            key:'player'
        });
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