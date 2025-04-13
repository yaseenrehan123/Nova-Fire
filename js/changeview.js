export class ChangeView{ // changes player and enemy directions for different view combat
    constructor(newRotation,gameSettings,playerSprite){
        this.targetRotation  = newRotation;
        this.rotation = 0;
        this.changeRate = 50; // 20 deg per sec
        this.delay = 2000 // 2s
        this.gameSettings = gameSettings;
        this.playerSprite = playerSprite;
        this.rotating = false;
        this.start();
    };
    start(){
        this.gameSettings.registerObject(this);
        // Start after delay
        setTimeout(() => {
            this.rotating = true;
        }, this.delay);
    };
    update(delta){//called by gameSettings
        if (!this.rotating) return;

        const direction = this.targetRotation > this.rotation ? 1 : -1;
        const rotationStep = this.changeRate * delta * direction;

        const remaining = Math.abs(this.targetRotation - this.rotation);

        if (remaining <= Math.abs(rotationStep)) {
            this.rotation = this.targetRotation;
            this.rotating = false; // Done rotating
        } else {
            this.rotation += rotationStep;
        }
        this.gameSettings.sceneRotation = this.rotation;
    };
};