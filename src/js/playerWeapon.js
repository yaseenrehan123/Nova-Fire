import { GreenBullet,BlueBullet,PurpleBullet } from "./bulletTypes.js";
export class PlayerWeapon{
    constructor(gameSettings,player){
        this.gameSettings = gameSettings;
        this.isFiring = false;
        this.bullets = ['GreenBullet','BlueBullet','PurpleBullet'];
        this.currentBullet = 'PurpleBullet';
        this.player = player;
        this.fireCounter = 0;
        this.start();
    };
    start(){
        this.gameSettings.registerObject(this);
        this.addFireListener();
    };
    update(deltaTime){
        this.subtractFireCounter(deltaTime);
        this.fire();
        this.player.shootAnimation(this.isFiring);
        //console.log(this.fireCounter);
    };
    addFireListener(){
        ['mousedown','touchstart'].forEach(event => {
            window.addEventListener(event,()=>{
                this.isFiring = true;
            });
        });
        ['mouseup','touchend'].forEach(event =>{
            window.addEventListener(event,()=>{
                this.isFiring = false;
            });
        });
    };
    fire(){
        if(this.isFiring && this.fireCounter <= 0){
            let bullet =  null;
            switch (this.currentBullet){
                case this.bullets[0]:
                    bullet = new GreenBullet(this.player.position,this.player.directionAngle + 90,this.gameSettings);
                    this.resetFireCounter(bullet);
                    break;
                case this.bullets[1]:
                    bullet = new BlueBullet(this.player.position,this.player.directionAngle + 90,this.gameSettings)
                    this.resetFireCounter(bullet);
                    break;
                case this.bullets[2]:
                    bullet = new PurpleBullet(this.player.position,this.player.directionAngle + 90,this.gameSettings)
                    this.resetFireCounter(bullet);
                    break;
                default:
                    console.log("No fire from array selected");
            };
        };
    };
    resetFireCounter(bullet){
        this.fireCounter = bullet.fireDelayInSeconds ;
    };
    subtractFireCounter(deltaTime){
        if(this.fireCounter > 0){
            this.fireCounter -= deltaTime;
        };
    };
};