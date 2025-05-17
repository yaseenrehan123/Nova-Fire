export class Bar{
    constructor(options){
        const {
            game = null,
            pos = {x:0,y:0},
            width = 300,
            height = 50,
            maxValue = 1,// have a max value of 1
            value = 0,
            fillColor = 'black',
            outline = {
                enabled: false,
                color: 'grey',
                width: 8,
            },
            background = {
                enabled:false,
                color:'black',
            },
            lerp = {
                enabled:false,
                step:0.2// usually the 't' or the speed of lerp, closer to 1 is faster
            }
           
        } = options;

        this.game = game;

        this.maxValue = maxValue;
        this.value = value;// starting value

        this.pos = pos;
        this.width = width;// max width or boundary
        this.height = height;
        this.fillColor = fillColor;

        this.outlineColor = outline.color;
        this.outlineWidth = outline.width;
        this.hasOutline = outline.enabled;

        this.hasBackground = background.enabled;
        this.backgroundColor = background.color;

        this.hasLerp = lerp.enabled;
        this.lerpStep = lerp.step;

        this.isVisible = true;
    };
    draw(){// call in update
        if(!this.isVisible) return;

        const ctx = this.game.ctx;
        const x = this.pos.x;
        const y = this.pos.y;
        const w = this.width;
        const h = this.height;
        const fillAmount = this.value / this.maxValue * w;
        ctx.save();
        //background
        if(this.hasBackground){
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(x,y,w,h);
        }
        
        //bar
        
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(x,y,fillAmount,h);

        //outline

        if(this.hasOutline){
            ctx.strokeStyle = this.outlineColor;
            ctx.lineWidth = this.outlineWidth;
            ctx.strokeRect(x,y,w,h);
        };
       
        ctx.restore();
    };
    setValue(newValue){
        this.value = newValue;
    };
    setMaxValue(newValue){
        this.maxValue = newValue;
    };
    lerpValue(newValue){
        if(!this.hasLerp) return;
        if(this.value != newValue){
            const prevValue = this.value;
            const lerpedValue = this.game.lerp(prevValue,newValue,this.lerpStep);
            //console.log("Effect bar lerp value:",lerpedValue);
            //console.log("PrevValue from lerp:",prevValue)
            //console.log("newValue from lerp:",newValue)

            this.setValue(lerpedValue);
        }
    };
    setFillColor(newColor){
        if(this.fillColor === newColor) return;
        this.fillColor = newColor;
    };
    setOutlineColor(newColor){
        if(this.outlineColor === newColor) return;
        this.outlineColor  =  newColor;
    }
    setBackGroundColor(newColor){
        if(this.backgroundColor === newColor) return;
        this.backgroundColor = newColor
    }
    setIsVisible(bool){
        this.isVisible = bool;
    }
    returnIsVisible(){
        return this.isVisible;
    };
};