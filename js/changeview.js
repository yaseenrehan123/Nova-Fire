export class ChangeView{ // changes player and enemy directions for different view combat
    constructor(options){
        const{
            newRotation=0,
            game=null
        } = options
        this.targetRotation  = newRotation;
        this.rotation = 0;
        this.changeRate = 50; // 20 deg per sec
        this.delay = 2000 // 2s
        this.gameSettings = game;
        this.rotating = false;
        this.start();
    };
    start(){
        this.gameSettings.addObj(this);
        // Start after delay
        setTimeout(() => {
            this.rotating = true;
            this.gameSettings.nextSceneRotation = this.targetRotation;
            this.gameSettings.totalSceneRotation = this.gameSettings.sceneRotation + this.gameSettings.nextSceneRotation;
        }, this.delay);
    };
    update(){//called by gameSettings
        if (!this.rotating) return;

        const direction = this.targetRotation > this.rotation ? 1 : -1;
        const rotationStep = this.changeRate * this.gameSettings.deltaTime * direction;

        const remaining = Math.abs(this.targetRotation - this.rotation);

        if (remaining <= Math.abs(rotationStep)) {
            this.rotation = this.targetRotation;
            this.rotating = false; // Done rotating
            this.gameSettings.ecs.customSystems.setBaseRotation();
        } else {
            this.rotation += rotationStep;
        }
        this.gameSettings.sceneRotation = this.rotation;

        this.gameSettings.ecs.customSystems.addSceneRotation();
    };
};