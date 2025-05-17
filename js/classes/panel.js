export class Panel{
    constructor(game){
        this.game = game;
        this.ctx = game.ctx;

        this.pos = {x:0,y:0};
        this.width = 100;
        this.height = 100;
        this.backGroundColor = 'black';
        this.isVisible = true;
        this.rounded = {
            enabled:false,
            radii: 0,
        };

        
    };
    draw(){
        if(!this.isVisible) return;

        const ctx = this.ctx;
        const x = this.pos.x;
        const y = this.pos.y;
        const w = this.width;
        const h = this.height;
        const isRounded = this.rounded.enabled;
        const color = this.backGroundColor;
        ctx.save();

        ctx.fillStyle = color;

        ctx.beginPath();
        
        if(isRounded){
            const radii = this.rounded.radii;
            ctx.roundRect(x,y,w,h,radii);
        }
        else{
            ctx.rect(x,y,w,h);
        }

        ctx.fill()

        ctx.restore();
    
    };
    setPosition(newPos){
        this.pos = newPos;
    };
    setWidth(newWidth){
        this.width = newWidth;
    };
    setHeight(newHeight){
        this.height = newHeight;
    };
    setBackgroundColor(newColor){
        this.backGroundColor = newColor;
    };
    setRoundedOptions(options){
        this.rounded = options;
    };
    setIsVisible(bool){
        this.isVisible = bool;
    };
    returnIsVisible(){
        return this.isVisible;
    };
    setCenteredPosition(centerX, centerY) {
    this.pos.x = centerX - this.width / 2;
    this.pos.y = centerY - this.height / 2;
}
}