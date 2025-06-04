export class MainMenuUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;

        this.titleTextEntity = null;
        this.playBtnEntity = null;
        this.playBtnTextEntity = null;
        this.newGameBtnEntity = null;
        this.newGameBtnTextEntity = null;
        this.settingsBtnEntity = null;
        this.settingBtnTextEntity = null;
        this.confirmNewGamePanelEntity = null;
        this.confirmNewGamePanelTextEntity = null;
        this.proceedNewGameBtnEntity = null;
        this.proceedNewGameBtnTextEntity = null;
        this.cancelNewGameBtnEntity = null;
        this.cancelNewGameBtnTextEntity = null;

        this.start();
    };
    start() {
        this.initTitleTextEntity();
        this.initPlayBtnEntity();
        this.initPlayBtnTextEntity();
        this.initNewGameBtnEntity();
        this.initNewGameBtnTextEntity();
        this.initSettingsBtnEntity();
        this.initSettingsBtnTextEntity();
        this.initConfirmNewGamePanelEntity();
        this.initConfirmNewGamePanelTextEntity();
        this.initProceedNewGameBtnEntity();
        this.initProceedNewGameBtnTextEntity();
        this.initCancelNewGameBtnEntity();
        this.initCancelNewGameBtnTextEntity();
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
                        this.game.ui.pauseUi.refreshCheckboxStates();
                        this.gameUtils.unPauseGame();
                        this.game.ecs.customSystems.addSceneRotation();
                        this.game.enemyWaveSpawner.startWaves();
                        this.gameUtils.playSfx('buttonClick');
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
                        this.gameUtils.setIsActive(this.confirmNewGamePanelEntity, true);
                        this.gameUtils.playSfx('buttonClick');
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
    initSettingsBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)';
        this.settingsBtnEntity = this.gameUtils.spawnEntity({
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
                        this.gameUtils.loadScene(this.game.settingsSceneEntity);
                        this.game.ui.settingsSceneUi.refreshCheckboxStates();
                        this.gameUtils.playSfx('buttonClick');
                    }
                },
                anchoring: {
                    offsetY: 200
                }

            }
        });
        this.gameUtils.anchorEntity(this.settingsBtnEntity, this.game.mainMenuSceneEntity);
    };
    initSettingsBtnTextEntity() {
        this.settingBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'SETTINGS',
                parent: this.settingsBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.settingBtnTextEntity, this.settingsBtnEntity);
    };
    initConfirmNewGamePanelEntity() {
        const bgColor = 'rgb(33, 76, 141)';
        this.confirmNewGamePanelEntity = this.gameUtils.spawnEntity({
            passedKey: 'panel',
            componentsToModify: {
                width: 900,
                height: 400,
                shapeColor: bgColor,
                rectangleShape: {
                    rounded: {
                        enabled: true,
                    }
                },
                orderingLayer: 11,
                parent: this.game.mainMenuSceneEntity,
                isActive: false
            }
        });
        this.gameUtils.anchorEntity(this.confirmNewGamePanelEntity, this.game.mainMenuSceneEntity);
    };
    initConfirmNewGamePanelTextEntity() {
        this.confirmNewGamePanelTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 50,
                fontContent: 'DELETE ALL DATA',
                parent: this.confirmNewGamePanelEntity,
                anchoring:{
                    anchorY:'top'
                }
            }
        });
        this.gameUtils.anchorEntity(this.confirmNewGamePanelTextEntity, this.confirmNewGamePanelEntity);
    }
    initProceedNewGameBtnEntity() {
        const btnColor = 'rgb(32, 189, 24)';
        this.proceedNewGameBtnEntity = this.gameUtils.spawnEntity({
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
                parent: this.confirmNewGamePanelEntity,
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        this.game.progressStorageManager.deleteData();
                        this.gameUtils.setIsActive(this.confirmNewGamePanelEntity, false);
                        this.gameUtils.playSfx('buttonClick');
                    }
                },
                anchoring: {
                    anchorX: 'right',
                    anchorY: 'bottom',
                    offsetX: -25,
                    offsetY: -25
                }

            }
        });
        this.gameUtils.anchorEntity(this.proceedNewGameBtnEntity, this.confirmNewGamePanelEntity);
    };
    initProceedNewGameBtnTextEntity() {
        this.proceedNewGameBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'PROCEED',
                parent: this.proceedNewGameBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.proceedNewGameBtnTextEntity, this.proceedNewGameBtnEntity);
    };
    initCancelNewGameBtnEntity() {
        const btnColor = 'rgb(106, 27, 27)'; // red tone for cancel
        this.cancelNewGameBtnEntity = this.gameUtils.spawnEntity({
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
                parent: this.confirmNewGamePanelEntity,
                button: {
                    clickBoxWidth: 200,
                    clickBoxHeight: 100,
                    onPress: () => {
                        this.gameUtils.setIsActive(this.confirmNewGamePanelEntity, false);
                        this.gameUtils.playSfx('buttonClick');
                    }
                },
                anchoring: {
                    anchorX: 'left',
                    anchorY: 'bottom',
                    offsetX: 25,
                    offsetY: -25
                }
            }
        });
        this.gameUtils.anchorEntity(this.cancelNewGameBtnEntity, this.confirmNewGamePanelEntity);
    };
    initCancelNewGameBtnTextEntity() {
        this.cancelNewGameBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'CANCEL',
                parent: this.cancelNewGameBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.cancelNewGameBtnTextEntity, this.cancelNewGameBtnEntity);
    };

};