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

        this.healthBarEntity = null;
        this.energyBarEntity = null;

        this.start();
    };
    start(){
       this.game.addObj(this);
       
       this.initHealthBar();
       this.initEnergyBar();
      
    };
    update(){
        
        this.game.ui.playerUi.updateEnergyBar();

    };
    updateHealthBar(){
        const maxHealth = this.game.player.maxHealth;
        const currentHealth = this.game.player.playerEntity.getComponent('health');
        this.game.setBarValue({
            max:maxHealth,
            current:currentHealth,
            barEntity:this.healthBarEntity
        });

    };
    initHealthBar(){

        const outlineColor = 'rgb(30, 28, 39)';
        const backGroundFillColor = 'rgb(3, 0, 14)';
        const healthFillColor = 'rgb(1, 213, 11)';

        this.healthBarEntity = this.game.spawnEntity({
            passedKey: 'bar',
            componentsToModify: {
                pos: { x: 0, y: 0 },
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

        this.energyBarEntity = this.game.spawnEntity({
            passedKey:'bar',
            componentsToModify:{
                pos:{x:0,y:54},
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
        const max = shootEnergyComponent.max;
        const current = shootEnergyComponent.current;
        this.game.setBarValue({
            max:max,
            current:current,
            barEntity:this.energyBarEntity
        });
    };
};
class SettingsUi{
    constructor(game){
        this.game = game;
        this.ctx = game.ctx;

        this.settingsBtn = null;
        this.settingsBtnEntity = null;
        this.settingsBtnTextEntity = null;
        this.settingsPanelEntity = null;
        
        this.start();
    };
    start(){
        this.game.addObj(this);
        this.initSettingsBtn();
        this.initSettingsPanel();
    };
    update(){
        this.settingsBtn.draw();
    };
    initSettingsBtn(){
        this.settingsBtn = new Button(this.game);

        const bgColor = 'rgb(27, 43, 68)';
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
            this.game.setIsActive(this.settingsPanelEntity,true);
            this.game.pauseGame();;
        });
        this.settingsBtn.setOnRelease(()=>{
            console.log("Settings Btn Released");
        })
        this.settingsBtnEntity = this.game.spawnEntity({
            passedKey:'button',
            componentsToModify:{
                pos:{x:0,y:0},
                width:200,
                height:100,
                shapeColor:bgColor,
                rectangleShape:{
                    rounded:{
                        enabled:true,
                        radius:8
                    },
                },
                alignment:{
                    alignmentX:'right',
                    alignmentY:'bottom',
                    borderWidth:this.game.width,
                    borderHeight:this.game.height
                }
            }
        });
        const settingsBtnWidth = this.settingsBtnEntity.getComponent('width');
        const settingsBtnHeight = this.settingsBtnEntity.getComponent('height');
        this.settingsBtnTextEntity = this.game.spawnEntity({
            passedKey:'text',
            componentsToModify:{
                fontSize:30,
                fontContent:'Settings Btn',
                alignment:{
                    borderWidth:settingsBtnWidth,
                    borderHeight:settingsBtnHeight,
                    offsetX:1720,
                    offsetY:980,
                    alignmentX:'center',
                    alignmentY:'middle'
                }
            }
        });
        //console.log(this.settingsBtnTextEntity)
    };
    initSettingsPanel(){
        const bgColor = 'rgb(33, 76, 141)';
        const screenWidth = this.game.width;
        const screenHeight = this.game.height;

        this.settingsPanelEntity = this.game.spawnEntity({
            passedKey:'panel',
            componentsToModify:{
                pos:this.game.screenCenterPos,
                width:900,
                height:700,
                shapeColor:bgColor,
                rectangleShape:{
                    rounded:{
                        enabled:true
                    },
                },
                alignment: {
                    borderWidth: screenWidth,
                    borderHeight: screenHeight,
                },
                isActive:false
            }
        })
    };
}
