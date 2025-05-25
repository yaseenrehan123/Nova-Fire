import { Bar } from "./classes/bar.js";
import { Button } from "./classes/button.js";
import { Panel } from "./classes/panel.js";
export class Ui {
    constructor(game) {
        this.game = game;
        this.playerUi = new PlayerUi(game);
        this.settingsUi = new SettingsUi(game);

    };
};
class PlayerUi {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;

        this.healthBarEntity = null;
        this.energyBarEntity = null;

        this.start();
    };
    start() {
        this.game.gameUtils.addObj(this);

        this.initHealthBar();
        this.initEnergyBar();

    };
    update() {

        this.game.ui.playerUi.updateEnergyBar();

    };
    updateHealthBar() {
        const maxHealth = this.game.player.maxHealth;
        const currentHealth = this.game.player.playerEntity.getComponent('health');
        this.game.gameUtils.setBarValue({
            max: maxHealth,
            current: currentHealth,
            barEntity: this.healthBarEntity
        });

    };
    initHealthBar() {

        const outlineColor = 'rgb(30, 28, 39)';
        const backGroundFillColor = 'rgb(3, 0, 14)';
        const healthFillColor = 'rgb(1, 213, 11)';

        this.healthBarEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'bar',
            componentsToModify: {
                pos: { x: 0, y: 0 },
                bar: {
                    fillColor: healthFillColor,
                    background: {
                        enabled: true,
                        color: backGroundFillColor
                    },
                    outline: {
                        enabled: true,
                        color: outlineColor
                    },
                    flashEffect: {
                        enabled: true,
                    }
                }

            }
        });


        this.updateHealthBar();


    };
    initEnergyBar() {

        const outlineColor = 'rgb(32, 30, 39)';
        const backGroundFillColor = 'rgb(3, 0, 14)';

        this.energyBarEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'bar',
            componentsToModify: {
                pos: { x: 0, y: 54 },
                width: 150,
                height: 30,
                bar: {
                    fillColor: 'purple',
                    background: {
                        enabled: true,
                        color: backGroundFillColor
                    },
                    outline: {
                        enabled: true,
                        color: outlineColor,
                        width: 4
                    },
                    flashEffect: {
                        enabled: true,
                        step: 0.1
                    }
                }
            }
        })

        this.updateEnergyBar();
    };
    updateEnergyBar() {
        const shootEnergyComponent = this.game.player.playerEntity.getComponent('shootEnergy');
        const max = shootEnergyComponent.max;
        const current = shootEnergyComponent.current;
        this.game.gameUtils.setBarValue({
            max: max,
            current: current,
            barEntity: this.energyBarEntity
        });
    };
};
class SettingsUi {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;

        this.settingsBtnEntity = null;
        this.settingsBtnTextEntity = null;
        this.settingsPanelEntity = null;
        this.pausedTextEntity = null;
        this.mainMenuBtnEntity = null;
        this.mainMenuTextEntity = null;
        this.unpauseBtnEntity = null;

        this.start();
    };
    start() {
        this.game.gameUtils.addObj(this);
        this.initSettingsBtn();
        this.initSettingsPanel();
    };
    update() {

    };
    initSettingsBtn() {
        const btnColor = 'rgb(27, 43, 68)';

        this.settingsBtnEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                width: 200,
                height: 100,
                shapeColor: btnColor,
                rectangleShape: {
                    rounded: {
                        enabled: true,
                        radius: 8
                    },
                },
                anchoring: {
                    anchorX: 'right',
                    anchorY: 'top',
                },
                button: {
                    clickBoxWidth: 200,
                    clickBoxHeight: 100,
                    onPress: () => {
                        this.game.gameUtils.setIsActive(this.settingsPanelEntity, true);
                        this.game.gameUtils.pauseGame();
                    },
                    onHover: () => {
                        const canvas = this.game.canvas;
                        canvas.style.cursor = 'pointer';
                    }
                },
                orderingLayer: 10
            }
        });
        this.game.gameUtils.anchorEntity(this.settingsBtnEntity, this.game.sceneEntity);

        this.initSettingsBtnText();
    };
    initSettingsBtnText() {
        const fontSize = 30;

        this.settingsBtnTextEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: fontSize,
                fontContent: 'Settings',
                parent: this.settingsBtnEntity
            }
        });
        this.game.gameUtils.calculateTextWidthAndHeight(this.settingsBtnTextEntity);
        this.game.gameUtils.anchorEntity(this.settingsBtnTextEntity, this.settingsBtnEntity);
    };
    initSettingsPanel() {
        const bgColor = 'rgb(33, 76, 141)';

        this.settingsPanelEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'panel',
            componentsToModify: {
                pos: this.game.screenCenterPos,
                width: 900,
                height: 700,
                shapeColor: bgColor,
                rectangleShape: {
                    rounded: {
                        enabled: true
                    },
                },
                isActive: false,
                orderingLayer: 10
            }
        });
        this.game.gameUtils.anchorEntity(this.settingsPanelEntity, this.game.sceneEntity);

        this.initPausedText();
        this.initMainMenuBtn();
        this.initMainBtnText();
        this.initUnpauseButton();
    };
    initPausedText() {
        this.pausedTextEntity = this.game.gameUtils.spawnEntity({
            passedKey: "text",
            componentsToModify: {
                fontSize: 80,
                anchoring: {
                    anchorY: 'top'
                },
                fontContent: 'Paused',
                parent: this.settingsPanelEntity
            }
        });
        this.game.gameUtils.anchorEntity(this.pausedTextEntity, this.settingsPanelEntity);
    };
    initMainMenuBtn() {
        const btnColor = 'rgb(27, 59, 106)';
        this.mainMenuBtnEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                width: 200,
                height: 100,
                shapeColor: btnColor,
                rectangleShape: {
                    rounded: {
                        enabled: true,
                        radius: 6
                    }
                },
                anchoring: {
                    anchorY: 'top',
                    offsetY: 150
                },
                button: {
                    clickBoxWidth: 200,
                    clickBoxHeight: 100
                },
                parent: this.settingsPanelEntity
            }
        });
        this.game.gameUtils.anchorEntity(this.mainMenuBtnEntity, this.settingsPanelEntity);
    };
    initMainBtnText() {
        this.mainMenuTextEntity = this.game.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'MainMenu',
                parent: this.mainMenuBtnEntity
            }
        });
        this.game.gameUtils.anchorEntity(this.mainMenuTextEntity, this.mainMenuBtnEntity);
    };
    initUnpauseButton(){
        this.unpauseBtnEntity = this.game.gameUtils.spawnEntity({
            passedKey:'textureButton',
            componentsToModify:{
                anchoring:{
                    anchorX:'right',
                    anchorY:'top',
                    offsetX:25,
                    offsetY:-25
                },
                parent:this.settingsPanelEntity,
                button:{
                   onPress: () => {
                    this.game.gameUtils.unPauseGame();
                    this.game.gameUtils.setIsActive(this.settingsPanelEntity,false);
                   }
                }
            }
        });
        this.game.gameUtils.anchorEntity(this.unpauseBtnEntity,this.settingsPanelEntity);
    };
}
