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
        this.healthBarPercentage = 0;
        this.effectBarPercentage = 0;
        this.prevBarPercentage = 0;
        this.start();
    };
    start(){
       this.game.addObj(this);

       this.updateBar();
    };
    update(){
        //console.log("Update called from player ui!");

        this.drawHealthBar();
        
        if(this.effectBarPercentage != this.barPercentage){
            this.effectBarPercentage = this.game.lerp(this.effectBarPercentage,this.barPercentage,0.2);
        }
    }
    drawHealthBar(){
        const x = 0;
        const y = 0;
        const w = 300;
        const h = 50;

        const barBackgroundColor = 'rgb(3, 0, 14)'
        const barOutlineColor = 'rgb(30, 28, 39)';
        const healthBarColor = 'rgb(1, 213, 11)';
        const effectBarColor = 'white'

        const healthBarWidth = this.barPercentage * w;
        const effectBarWidth = this.effectBarPercentage * w;

        this.ctx.save();
        
        //background
        this.ctx.fillStyle = barBackgroundColor;
        this.ctx.fillRect(x,y,w,h);
        this.ctx.strokeStyle = barOutlineColor;

        //outline
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(x, y, w, h);

        //effect bar
        this.ctx.fillStyle = effectBarColor;
        this.ctx.fillRect(x,y,effectBarWidth,h);

        //health bar
        this.ctx.fillStyle = healthBarColor;
        this.ctx.fillRect(x,y,healthBarWidth,h);
        
        this.ctx.restore();
      
    }
    updateBar(){
        const maxHealth = this.game.player.maxHealth;
        const currentHealth = this.game.player.playerEntity.getComponent('health');
        const barPercentage = currentHealth / maxHealth;
        this.barPercentage = barPercentage;
        this.prevBarPercentage = barPercentage;
    };
}