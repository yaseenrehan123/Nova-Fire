export class PlayerUi {
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