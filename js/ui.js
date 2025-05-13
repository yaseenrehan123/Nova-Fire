export class Ui{
    constructor(game){
        this.game = game;
        this.playerUi = new PlayerUi(game);
    };
};
class PlayerUi{
    constructor(game){
        this.game = game;
        this.ctx = game.ctx;

        //this.healthBackgroundBar = null;
        this.healthBar = null;
        this.healthEffectBar = null;

        this.start();
    };
    start(){
       this.game.addObj(this);
       
       this.initHealthBar();
       
      
    };
    update(){
        //console.log("Update called from player ui!");
        //console.log("Effect bar value",this.healthEffectBar.value)
        this.healthEffectBar.draw();
        this.healthBar.draw();
        
        this.healthEffectBar.lerpValue(this.barPercentage);
        
    };
    updateHealthBar(){
        const maxHealth = this.game.player.maxHealth;
        const currentHealth = this.game.player.playerEntity.getComponent('health');
        const barPercentage = currentHealth / maxHealth;
        this.barPercentage = barPercentage;

        this.healthBar.setValue(barPercentage);

    };
    initHealthBar(){

        const outlineColor = 'rgb(30, 28, 39)';
        const backGroundFillColor = 'rgb(3, 0, 14)';
        const healthFillColor = 'rgb(1, 213, 11)';
        const effectFillColor = 'white';

        this.healthBar = new Bar({
            game:this.game,
            pos:{x:0,y:0},
            width:300,
            height:50,
            fillColor:healthFillColor,
        });

        this.healthEffectBar = new Bar({
            game:this.game,
            pos:{x:0,y:0},
            width:300,
            height:50,
            fillColor:effectFillColor,
            outline:{
                enabled:true,
                color:outlineColor,
                width:8
            },
            background:{
                enabled:true,
                color:backGroundFillColor
            },
            lerp:{
                enabled:true,
                step:0.2
            }
        });
        this.healthEffectBar.setValue(1);
        this.updateHealthBar();
    };
};
class Bar{
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
    };
    draw(){// call in update 
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
};