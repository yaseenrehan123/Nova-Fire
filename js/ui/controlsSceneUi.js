export class ControlsSceneUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;

        this.movementTextPanelEntity = null;
        this.movementTextEntity = null;
        this.shootTextPanelEntity = null;
        this.shootTextEntity = null;
        this.pauseTextPanelEntity = null;
        this.pauseTextEntity = null;
        this.backBtnEntity = null;
        this.backBtnTextEntity = null;

        this.start();
    };
    start() {
        this.initMovementTextPanelEntity();
        this.initMovementTextEntity();
        this.initShootTextPanelEntity();
        this.initShootTextEntity();
        this.initPauseTextPanelEntity();
        this.initPauseTextEntity();
        this.initBackBtnEntity();
        this.initBackBtnTextEntity();
    };
    initMovementTextPanelEntity() {
        const color = 'rgb(27, 59, 106)';
        this.movementTextPanelEntity = this.gameUtils.spawnEntity({
            passedKey: 'panel',
            componentsToModify: {
                width: 800,
                height: 100,
                parent: this.game.controlsSceneEntity,
                shapeColor: color,
                rectangleShape: {
                    rounded: {
                        enabled: true
                    }
                },
                anchoring: {
                    anchorY: 'top',
                    offsetY: 50
                }
            }
        });
        this.gameUtils.anchorEntity(this.movementTextPanelEntity, this.game.controlsSceneEntity);
    };
    initMovementTextEntity() {
        this.movementTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'MOVE: MOUSE',
                parent: this.movementTextPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.movementTextEntity, this.movementTextPanelEntity);
    };
    initShootTextPanelEntity() {
        const color = 'rgb(27, 59, 106)';
        this.shootTextPanelEntity = this.gameUtils.spawnEntity({
            passedKey: 'panel',
            componentsToModify: {
                width: 800,
                height: 100,
                parent: this.game.controlsSceneEntity,
                shapeColor: color,
                rectangleShape: {
                    rounded: {
                        enabled: true
                    }
                },
                anchoring: {
                    anchorY: 'top',
                    offsetY: 170
                }
            }
        });
        this.gameUtils.anchorEntity(this.shootTextPanelEntity, this.game.controlsSceneEntity);
    };
    initShootTextEntity() {
        this.shootTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'SHOOT: RIGHT MOUSE BUTTON',
                parent: this.shootTextPanelEntity,
            }
        });
        this.gameUtils.anchorEntity(this.shootTextEntity, this.shootTextPanelEntity);
    };
    initPauseTextPanelEntity() {
        const color = 'rgb(27, 59, 106)';
        this.pauseTextPanelEntity = this.gameUtils.spawnEntity({
            passedKey: 'panel',
            componentsToModify: {
                width: 800,
                height: 100,
                parent: this.game.controlsSceneEntity,
                shapeColor: color,
                rectangleShape: {
                    rounded: {
                        enabled: true
                    }
                },
                anchoring: {
                    anchorY: 'top',
                    offsetY: 290
                }
            }
        });
        this.gameUtils.anchorEntity(this.pauseTextPanelEntity, this.game.controlsSceneEntity);
    };
    initPauseTextEntity() {
        this.pauseTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'PAUSE: SPACEBAR (PC ONLY)',
                fontStyle: '',
                parent: this.pauseTextPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.pauseTextEntity, this.pauseTextPanelEntity);
    };
    initBackBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)';
        this.backBtnEntity = this.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                anchoring: {
                    anchorX: 'right',
                    anchorY: 'top'
                },
                parent: this.game.controlsSceneEntity,
                shapeColor: btnColor,
                width: 200,
                height: 100,
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        this.gameUtils.loadScene(this.game.settingsSceneEntity);
                        this.gameUtils.playSfx('buttonClick');
                    }
                }
            }
        });
        this.gameUtils.anchorEntity(this.backBtnEntity, this.game.controlsSceneEntity);
    };
    initBackBtnTextEntity() {
        this.backBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'BACK',
                parent: this.backBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.backBtnTextEntity, this.backBtnEntity);
    };
};