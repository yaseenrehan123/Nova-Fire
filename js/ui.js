import { Bar } from "./classes/bar.js";
import { Button } from "./classes/button.js";
import { Panel } from "./classes/panel.js";
export class Ui{
    constructor(game){
        this.game = game;
        this.playerUi = new PlayerUi(game);
        this.settingsUi = new SettingsUi(game);

    };
};
class PlayerUi{
    constructor(game){
        this.game = game;
        this.ctx = game.ctx;

        //this.healthBackgroundBar = null;
        this.healthBar = null;
        this.healthEffectBar = null;
        this.healthBarEntity = null;
        this.energyBarEntity = null;
        this.energyBar = null;
        this.energyEffectBar = null;

        this.barPercentage = null;
        this.energyBarPercentage = null;

        this.start();
    };
    start(){
       this.game.addObj(this);
       
       this.initHealthBar();
       this.initEnergyBar();
      
    };
    update(){
        //console.log("Update called from player ui!");
        //console.log("Effect bar value",this.healthEffectBar.value)
        this.healthEffectBar.draw();
        this.healthBar.draw();
        
        this.energyEffectBar.draw();
        this.energyBar.draw();
        
        this.game.ui.playerUi.updateEnergyBar();

        this.healthEffectBar.lerpValue(this.barPercentage);
        this.energyEffectBar.lerpValue(this.energyBarPercentage);
        
    };
    updateHealthBar(){
        const maxHealth = this.game.player.maxHealth;
        const currentHealth = this.game.player.playerEntity.getComponent('health');
        const barPercentage = currentHealth / maxHealth;
        this.barPercentage = barPercentage;
        
        this.healthBar.setValue(barPercentage);
        const healthBarComponent = this.healthBarEntity.getComponent('bar');
        const flashEffectEnabled = healthBarComponent.flashEffect.enabled;
        if(flashEffectEnabled){
            healthBarComponent.flashEffect.prevValue = healthBarComponent.flashEffect.value;
            healthBarComponent.flashEffect.targetValue = barPercentage;
        }
        healthBarComponent.value = barPercentage;

        //console.log("FLASH PREVVALUE: ",healthBarComponent.flashEffect.prevValue);
        //console.log("Flash TARGET VALUE:",healthBarComponent.flashEffect.targetValue);
        this.healthBarEntity.setComponent('bar',healthBarComponent);

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
        });

        this.healthEffectBar = new Bar({
            game:this.game,
            pos:{x:0,y:0},
            width:300,
            height:50,
            outline:{
                enabled:true,
                width:8
            },
            background:{
                enabled:true,
            },
            lerp:{
                enabled:true,
                step:0.2
            }
        });
        this.healthBar.setFillColor(healthFillColor);

        this.healthEffectBar.setBackGroundColor(backGroundFillColor);
        this.healthEffectBar.setOutlineColor(outlineColor);
        this.healthEffectBar.setFillColor(effectFillColor)
        this.healthEffectBar.setValue(1);

        this.healthBarEntity = this.game.spawnEntity({
            passedKey: 'bar',
            componentsToModify: {
                pos: { x: 500, y: 500 },
                bar: {
                    fillColor:healthFillColor,
                    background:{
                        enabled:true,
                        color:backGroundFillColor
                    },
                    outline:{
                        enabled:true,
                        color:outlineColor
                    },
                    flashEffect:{
                        enabled:true,
                    }
                }

            }
        });
       
        this.updateHealthBar();

        
    };
    initEnergyBar(){

        const outlineColor = 'rgb(32, 30, 39)';
        const backGroundFillColor = 'rgb(3, 0, 14)';

        this.energyBar = new Bar({
            game:this.game,
            pos:{x:0,y:54},
            width:150,
            height:30,
        });

        this.energyEffectBar = new Bar({
            game:this.game,
            pos:{x:0,y:54},
            width:150,
            height:30,
            outline:{
                enabled:true,
                width:4
            },
            background:{
                enabled:true,
            },
            lerp:{
                enabled:true,
                step:0.1
            }
        })

        this.energyBar.setValue(1);

        this.energyEffectBar.setFillColor('white');
        this.energyEffectBar.setOutlineColor(outlineColor);
        this.energyEffectBar.setBackGroundColor(backGroundFillColor);
        
        this.energyBarEntity = this.game.spawnEntity({
            passedKey:'bar',
            componentsToModify:{
                pos:{x:500,y:600},
                width:150,
                height:30,
                bar:{
                    fillColor:'purple',
                    background:{
                        enabled:true,
                        color:backGroundFillColor
                    },
                    outline:{
                        enabled:true,
                        color:outlineColor,
                        width:4
                    },
                    flashEffect:{
                        enabled:true,
                        step:0.1
                    }
                }
            }
        })

        this.updateEnergyBar();
    };
    updateEnergyBar(){
        const shootEnergyComponent = this.game.player.playerEntity.getComponent('shootEnergy');
        const energyBarPercentage = shootEnergyComponent.current / shootEnergyComponent.max;
        this.energyBar.setValue(energyBarPercentage);
        this.energyBarPercentage = energyBarPercentage;

        const barComponent = this.energyBarEntity.getComponent('bar');
        const flashEffectEnabled = barComponent.flashEffect.enabled;
        if(flashEffectEnabled){
            barComponent.flashEffect.prevValue = barComponent.flashEffect.value;
            barComponent.flashEffect.targetValue = energyBarPercentage;
        }
        barComponent.value = energyBarPercentage;

        this.energyBarEntity.setComponent('bar',barComponent);
    };
};
class SettingsUi{
    constructor(game){
        this.game = game;
        this.ctx = game.ctx;

        this.settingsBtn = null;
        this.settingsPanel = null;

        this.start();
    };
    start(){
        this.game.addObj(this);
        this.initSettingsBtn();
        this.initSettingsPanel();
    };
    update(){
        this.settingsBtn.draw();
        this.settingsPanel.draw();
    };
    initSettingsBtn(){
        this.settingsBtn = new Button(this.game);

        const bgColor = 'rgb(34, 40, 49)';
        const fontSize = 30;

        this.settingsBtn.setBackgroundColor(bgColor);
        this.settingsBtn.setFontSize(fontSize);
        this.settingsBtn.setPos({
            x:1720,
            y:0
        });
        this.settingsBtn.setWidth(200);
        this.settingsBtn.setHeight(100);
        this.settingsBtn.setFontText('Settings');
        this.settingsBtn.setOnPress(()=>{
            this.settingsPanel.setIsVisible(true);
            this.game.pauseGame();;
        });
        this.settingsBtn.setOnRelease(()=>{
            console.log("Settings Btn Released");
        })
    };
    initSettingsPanel(){
        this.settingsPanel = new Panel(this.game);

        const bgColor = 'rgb(33, 76, 141)';
        const centerX = this.game.screenCenterPos.x;
        const centerY = this.game.screenCenterPos.y;
        this.settingsPanel.setBackgroundColor(bgColor);
        this.settingsPanel.setWidth(900);
        this.settingsPanel.setHeight(700);
        this.settingsPanel.setCenteredPosition(centerX,centerY);
        this.settingsPanel.setIsVisible(false);

    };
}
