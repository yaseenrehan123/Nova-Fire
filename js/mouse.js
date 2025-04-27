export class Mouse{
    constructor(game){
        this.pos = {x:0,y:0}
        this.canvas = game.canvas;
        this.listener();
    };
    listener(){
        const eventNames = ['mousemove','touchstart','touchmove'];
        eventNames.forEach((eventName)=>{
            this.canvas.addEventListener(eventName,(e)=>{
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
    
                switch (eventName){
                    case 'mousemove':
                        this.pos.x = (e.clientX - rect.left) * scaleX;
                        this.pos.y = (e.clientY - rect.top) * scaleY;
                        break;
                    default:
                        if(e.touches.length < 1)return;
                        this.pos.x = (e.touches[0].clientX - rect.left) * scaleX;
                        this.pos.y = (e.touches[0].clientY - rect.top) * scaleY;
                        break;
                }
                console.log(this.pos);
            },{passive:true});
        });
    }
}