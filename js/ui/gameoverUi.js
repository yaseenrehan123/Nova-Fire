export class GameoverUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;

        this.gameoverPanelEntity = null;
        this.gameoverTextEntity = null;
        this.waveReachedTextEntity = null;
        this.mainMenuBtnEntity = null;
        this.mainMenuBtnTextEntity = null;

        this.start();
    };
    start() {
        this.initGameoverPanelEntity();
    };
    initGameoverPanelEntity() {
        const bgColor = 'rgb(33, 76, 141)';
        this.gameoverPanelEntity = this.gameUtils.spawnEntity({
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
                orderingLayer: 10,
            }
        });
        this.gameUtils.anchorEntity(this.gameoverPanelEntity, this.game.sceneEntity);

        this.initGameoverTextEntity();
        this.initWaveReachedTextEntity();
        this.initMainMenuBtnEntity();
        this.initMainMenuBtnTextEntity();
    };
    initGameoverTextEntity() {
        this.gameoverTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 80,
                fontContent: 'Game Over !',
                anchoring: {
                    anchorY: 'top'
                },
                parent: this.gameoverPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.gameoverTextEntity, this.gameoverPanelEntity);
    };
    initWaveReachedTextEntity() {
        this.waveReachedTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 50,
                fontContent: `Wave Reached: ${this.game.enemyWaveSpawner.currentWaveIndex}`,
                anchoring: {
                    anchorY: 'top',
                    offsetY: 150
                },
                parent: this.gameoverPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.waveReachedTextEntity, this.gameoverPanelEntity);
    };
    setWaveReachedText(){
        this.gameUtils.setFontContent(this.waveReachedTextEntity,`Wave Reached: ${this.game.enemyWaveSpawner.currentWaveIndex}`)
    };
    initMainMenuBtnEntity() {
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
                button: {
                    clickBoxWidth: 200,
                    clickBoxHeight: 100,
                    onPress: () => {
                        this.gameUtils.loadScene(this.game.mainMenuSceneEntity);
                        this.gameUtils.playSfx('buttonClick');
                    }
                },
                parent: this.gameoverPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.mainMenuBtnEntity, this.gameoverPanelEntity);
    };
    initMainMenuBtnTextEntity() {
        this.mainMenuTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'MainMenu',
                parent: this.mainMenuBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.mainMenuTextEntity, this.mainMenuBtnEntity);
    }
}
