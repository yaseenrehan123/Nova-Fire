export class Ui {
    constructor(game) {
        this.game = game;

        this.mainMenuUi = new MainMenuUi(game);
        this.playerUi = new PlayerUi(game);
        this.settingsUi = new SettingsUi(game);
    };
};
class PlayerUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;
        this.ctx = game.ctx;

        this.healthBarEntity = null;
        this.energyBarEntity = null;

        this.start();
    };
    start() {
        this.gameUtils.addObj(this);

        this.initHealthBar();
        this.initEnergyBar();

    };
    update() {

        this.game.ui.playerUi.updateEnergyBar();

    };
    updateHealthBar() {
        const maxHealth = this.game.player.maxHealth;
        const currentHealth = this.game.player.playerEntity.getComponent('health');
        this.gameUtils.setBarValue({
            max: maxHealth,
            current: currentHealth,
            barEntity: this.healthBarEntity
        });

    };
    initHealthBar() {

        const outlineColor = 'rgb(30, 28, 39)';
        const backGroundFillColor = 'rgb(3, 0, 14)';
        const healthFillColor = 'rgb(1, 213, 11)';

        this.healthBarEntity = this.gameUtils.spawnEntity({
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

        this.energyBarEntity = this.gameUtils.spawnEntity({
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
        this.gameUtils.setBarValue({
            max: max,
            current: current,
            barEntity: this.energyBarEntity
        });
    };
};
class SettingsUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;
        this.ctx = game.ctx;

        this.settingsBtnEntity = null;
        this.settingsBtnTextEntity = null;
        this.settingsPanelEntity = null;
        this.pausedTextEntity = null;
        this.mainMenuBtnEntity = null;
        this.mainMenuTextEntity = null;
        this.unpauseBtnEntity = null;
        this.musicCheckboxEntity = null;
        this.musicCheckboxTextEntity = null;
        this.sfxCheckboxEntity = null;
        this.sfxCheckboxTextEntity = null;
        this.start();
    };
    start() {
        this.gameUtils.addObj(this);
        this.initSettingsBtn();
        this.initSettingsPanel();
    };
    update() {

    };
    initSettingsBtn() {
        const btnColor = 'rgb(27, 43, 68)';

        this.settingsBtnEntity = this.gameUtils.spawnEntity({
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
                        this.gameUtils.setIsActive(this.settingsPanelEntity, true);
                        this.gameUtils.pauseGame();
                        this.gameUtils.playSfx('buttonClick');
                    },
                    onHover: () => {
                        const canvas = this.game.canvas;
                        canvas.style.cursor = 'pointer';
                    }
                },
                orderingLayer: 10
            }
        });
        this.gameUtils.anchorEntity(this.settingsBtnEntity, this.game.sceneEntity);

        this.initSettingsBtnText();
    };
    initSettingsBtnText() {
        const fontSize = 30;

        this.settingsBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: fontSize,
                fontContent: 'Settings',
                parent: this.settingsBtnEntity
            }
        });
        this.gameUtils.calculateTextWidthAndHeight(this.settingsBtnTextEntity);
        this.gameUtils.anchorEntity(this.settingsBtnTextEntity, this.settingsBtnEntity);
    };
    initSettingsPanel() {
        const bgColor = 'rgb(33, 76, 141)';

        this.settingsPanelEntity = this.gameUtils.spawnEntity({
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
        this.gameUtils.anchorEntity(this.settingsPanelEntity, this.game.sceneEntity);

        this.initPausedText();
        this.initMainMenuBtn();
        this.initMainMenuBtnText();
        this.initUnpauseButton();
        this.initMusicCheckbox();
        this.initMusicCheckboxText();
        this.initSfxCheckbox();
        this.initSfxCheckboxText();
    };
    initPausedText() {
        this.pausedTextEntity = this.gameUtils.spawnEntity({
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
        this.gameUtils.anchorEntity(this.pausedTextEntity, this.settingsPanelEntity);
    };
    initMainMenuBtn() {
        const btnColor = 'rgb(27, 59, 106)';
        this.mainMenuBtnEntity = this.gameUtils.spawnEntity({
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
                    clickBoxHeight: 100,
                    onPress: () =>{
                        this.gameUtils.loadScene(this.game.mainMenuSceneEntity);
                    }
                },
                parent: this.settingsPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.mainMenuBtnEntity, this.settingsPanelEntity);
    };
    initMainMenuBtnText() {
        this.mainMenuTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'MainMenu',
                parent: this.mainMenuBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.mainMenuTextEntity, this.mainMenuBtnEntity);
    };
    initUnpauseButton() {
        this.unpauseBtnEntity = this.gameUtils.spawnEntity({
            passedKey: 'textureButton',
            componentsToModify: {
                anchoring: {
                    anchorX: 'right',
                    anchorY: 'top',
                    offsetX: 25,
                    offsetY: -25
                },
                parent: this.settingsPanelEntity,
                button: {
                    onPress: () => {
                        this.gameUtils.unPauseGame();
                        this.gameUtils.setIsActive(this.settingsPanelEntity, false);
                        this.gameUtils.playSfx('buttonClick');
                    }
                }
            }
        });
        this.gameUtils.anchorEntity(this.unpauseBtnEntity, this.settingsPanelEntity);
    };
    initMusicCheckbox() {
        const btnColor = 'rgb(27, 59, 106)';
        this.musicCheckboxEntity = this.gameUtils.spawnEntity({
            passedKey: 'checkboxButton',
            componentsToModify: {
                parent: this.settingsPanelEntity,
                width: 200,
                height: 100,
                shapeColor: btnColor,
                checkbox: {
                    storageKey: 'music'
                },
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        const newValue = this.gameUtils.toggleCheckbox(this.musicCheckboxEntity);
                        const musicCheckBoxStorageKey = this.gameUtils.returnCheckboxStorageKey(this.musicCheckboxEntity);
                        this.game.settingsStorageManager.setProperty(musicCheckBoxStorageKey, newValue);
                        this.toggleMusicCheckboxText();
                        this.gameUtils.playSfx('buttonClick');
                        if (newValue === true) {
                            this.gameUtils.playLoopedMusic('backgroundMusic');
                        }
                        else {
                            this.game.soundManager.stopAllLoops();
                        }

                        console.log("SETTINGS PROPERTY STATE:", this.game.settingsStorageManager.getProperty('music'));
                        console.log("MUSIC CHECKBOX STATE:", this.musicCheckboxEntity.getComponent('checkbox'));
                    }
                }

            }
        });
        this.gameUtils.retrieveSavedCheckboxData(this.musicCheckboxEntity, this.game.settingsStorageManager);
        this.gameUtils.anchorEntity(this.musicCheckboxEntity, this.settingsPanelEntity);

        console.log("MUSIC CHECKBOX STATE:", this.musicCheckboxEntity.getComponent('checkbox'));
    };
    initMusicCheckboxText() {
        this.musicCheckboxTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontContent: 'Music:ON',
                parent: this.musicCheckboxEntity,
                fontSize: 30
            }
        });
        this.gameUtils.anchorEntity(this.musicCheckboxTextEntity, this.musicCheckboxEntity);
        this.toggleMusicCheckboxText();
    };
    toggleMusicCheckboxText() {
        this.gameUtils.toggleFontContentOnCheckbox(
            this.musicCheckboxEntity,
            this.musicCheckboxTextEntity,
            'Music: On',
            'Music: Off'
        );
    };
    initSfxCheckbox() {
        const btnColor = 'rgb(27, 59, 106)';
        this.sfxCheckboxEntity = this.gameUtils.spawnEntity({
            passedKey: 'checkboxButton',
            componentsToModify: {
                parent: this.settingsPanelEntity,
                width: 200,
                height: 100,
                shapeColor: btnColor,
                checkbox: {
                    storageKey: 'sfx'
                },
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        const newValue = this.gameUtils.toggleCheckbox(this.sfxCheckboxEntity);
                        const sfxCheckBoxStorageKey = this.gameUtils.returnCheckboxStorageKey(this.sfxCheckboxEntity);
                        this.game.settingsStorageManager.setProperty(sfxCheckBoxStorageKey, newValue);
                        this.toggleSfxCheckboxText();
                        this.gameUtils.playSfx('buttonClick');
                        console.log("SETTINGS PROPERTY STATE:", this.game.settingsStorageManager.getProperty('sfx'));
                        console.log("SFX CHECKBOX STATE:", this.sfxCheckboxEntity.getComponent('checkbox'));
                    }
                },
                anchoring: {
                    offsetY: 150
                }
            }
        });

        this.gameUtils.retrieveSavedCheckboxData(this.sfxCheckboxEntity, this.game.settingsStorageManager);
        this.gameUtils.anchorEntity(this.sfxCheckboxEntity, this.settingsPanelEntity);

        console.log("SFX CHECKBOX STATE:", this.sfxCheckboxEntity.getComponent('checkbox'));
    };
    initSfxCheckboxText() {
        this.sfxCheckboxTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontContent: 'SFX: ON',
                parent: this.sfxCheckboxEntity,
                fontSize: 30
            }
        });

        this.gameUtils.anchorEntity(this.sfxCheckboxTextEntity, this.sfxCheckboxEntity);
        this.toggleSfxCheckboxText();
    };
    toggleSfxCheckboxText() {
        this.gameUtils.toggleFontContentOnCheckbox(
            this.sfxCheckboxEntity,
            this.sfxCheckboxTextEntity,
            'SFX: On',
            'SFX: Off'
        );
    };

}
class MainMenuUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;

        this.titleTextEntity = null;
        this.playBtnEntity = null;
        this.playBtnTextEntity = null;
        this.newGameBtnEntity = null;
        this.newGameBtnTextEntity = null;

        this.start();
    };
    start() {
        this.initTitleTextEntity();
        this.initPlayBtnEntity();
        this.initPlayBtnTextEntity();
        this.initNewGameBtnEntity();
        this.initNewGameBtnTextEntity();
    };
    initTitleTextEntity() {
        this.titleTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 120,
                fontContent: 'NOVA FIRE',
                parent: this.game.mainMenuSceneEntity,
                anchoring: {
                    anchorY: 'top',
                    offsetY: 50
                }
            }
        });
        this.gameUtils.anchorEntity(this.titleTextEntity, this.game.mainMenuSceneEntity);
    }
    initPlayBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)';
        this.playBtnEntity = this.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                width: 200,
                height: 100,
                rectangleShape: {
                    rounded: {
                        enabled: true,
                        radius: 10
                    }
                },
                shapeColor: btnColor,
                parent: this.game.mainMenuSceneEntity,
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        this.gameUtils.loadScene(this.game.sceneEntity);
                    }
                },
                anchoring: {
                    offsetY: -200
                }

            }
        });
        this.gameUtils.anchorEntity(this.playBtnEntity, this.game.mainMenuSceneEntity);
    };
    initPlayBtnTextEntity() {
        this.playBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'Play',
                parent: this.playBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.playBtnTextEntity, this.playBtnEntity);
    };
    initNewGameBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)';
        this.newGameBtnEntity = this.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                width: 200,
                height: 100,
                rectangleShape: {
                    rounded: {
                        enabled: true,
                        radius: 10
                    }
                },
                shapeColor: btnColor,
                parent: this.game.mainMenuSceneEntity,
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {

                    }
                },
                anchoring: {
                    offsetY: 0
                }

            }
        });
        this.gameUtils.anchorEntity(this.newGameBtnEntity, this.game.mainMenuSceneEntity);
    };
    initNewGameBtnTextEntity() {
        this.newGameBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'NEW GAME',
                parent: this.newGameBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.newGameBtnTextEntity, this.newGameBtnEntity);
    };
}