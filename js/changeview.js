export class ChangeView {
    constructor({ newRotation = 0, game = null }) {
        this.gameSettings = game;
        this.startRotation = game.sceneRotation;
        this.targetRotation = this.startRotation + newRotation;
        this.rotation = this.startRotation;
        this.changeRate = 50; // degrees per second
        this.delay = 0;
        this.rotating = false;
        this.start();
    }

    start() {
        this.gameSettings.gameUtils.addObj(this);
        setTimeout(() => {
            this.rotating = true;
            this.gameSettings.nextSceneRotation = this.targetRotation - this.startRotation;
            this.gameSettings.totalSceneRotation = this.targetRotation;
        }, this.delay);
    }

    update() {
        if (!this.rotating) return;

        const diff = this.targetRotation - this.rotation;
        const direction = Math.sign(diff);
        const rotationStep = this.changeRate * this.gameSettings.deltaTime * direction;

        if (Math.abs(diff) <= Math.abs(rotationStep)) {
            this.rotation = this.targetRotation;
            this.rotating = false;
            this.gameSettings.ecs.customSystems.setBaseRotation();
        } else {
            this.rotation += rotationStep;
        }

        this.gameSettings.sceneRotation = this.rotation;
        this.gameSettings.ecs.customSystems.addSceneRotation();
    }
}
