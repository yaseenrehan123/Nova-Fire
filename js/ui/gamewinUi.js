export class GamewinUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;

        this.gamewinPanelEntity = null;
        this.gamewinTextEntity = null;
        this.mainMenuBtnEntity = null;
        this.mainMenuTextEntity = null;

        this.start();
    }

    start() {
        this.initGamewinPanelEntity();
    }

    initGamewinPanelEntity() {
        const bgColor = 'rgb(33, 76, 141)'; // changed to greenish tone to contrast "Game Over"
        this.gamewinPanelEntity = this.gameUtils.spawnEntity({
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
        this.gameUtils.anchorEntity(this.gamewinPanelEntity, this.game.sceneEntity);

        this.initGamewinTextEntity();
        this.initMainMenuBtnEntity();
        this.initMainMenuTextEntity();
    }

    initGamewinTextEntity() {
        this.gamewinTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 80,
                fontContent: 'You Win!',
                anchoring: {
                    anchorY: 'top'
                },
                parent: this.gamewinPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.gamewinTextEntity, this.gamewinPanelEntity);
    }

    initMainMenuBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)'; // greenish button
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
                parent: this.gamewinPanelEntity
            }
        });
        this.gameUtils.anchorEntity(this.mainMenuBtnEntity, this.gamewinPanelEntity);
    }

    initMainMenuTextEntity() {
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
