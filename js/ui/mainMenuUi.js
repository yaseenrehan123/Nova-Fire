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
};