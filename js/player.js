import { PlayerWeapon } from "./playerWeapon.js";
export class Player{
    position = {x:0,y:0};
    element;
    speed = 15;
    targetPosition = {x:0,y:0};
    touchActive;
    directionAngle = 0;
    debugDirectionRayLength = 150;
    playerSprite;
    constructor(position,gameSettings){
        this.position = position;
        this.targetPosition = { ...position };
        this.element = document.querySelector('.player');
        this.gameSettings = gameSettings;
        this.playerSprite = document.querySelector('.player-img');
        this.playerWeapon = new PlayerWeapon(gameSettings,this);
        gameSettings.registerObject(this);
    };
    update(deltaTime){
        this.movePlayer(deltaTime);
        this.calculateDirectionAngle();
        this.debugFacingDirection(this.gameSettings.ctx);
        this.changeRotationWithView(this.gameSettings);
    }
    movePlayer(deltaTime){
        //console.log("Player is moving");
        this.position.x += (this.targetPosition.x - this.position.x) * this.speed * deltaTime;
        this.position.y += (this.targetPosition.y - this.position.y) * this.speed * deltaTime;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    };
    playerInputListeners(){
        this.touchListeners();
        this.mouseListeners();
    };
    touchListeners(){
        ['touchstart','touchmove'].forEach(event =>{
            window.addEventListener(event,(e)=>{
                this.targetPosition.x = e.touches[0].clientX;
                this.targetPosition.y = e.touches[0].clientY;
                this.touchActive = true;
            });
        });
        ['touchcancel','touchend'].forEach(event => {
            window.addEventListener(event,()=>{
                this.touchActive = false;
            });
        });
    }
    mouseListeners(){
        window.addEventListener('mousemove',(e)=>{
            if(!this.touchActive){
                this.targetPosition.x = e.x;
                this.targetPosition.y = e.y;
            };
            
        });
    };
    debugFacingDirection(ctx){
        let angleRad = this.directionAngle * (Math.PI / 180); // Convert degrees to radians
        const endX = (this.position.x + Math.cos(angleRad) * this.debugDirectionRayLength);
        const endY = (this.position.y + Math.sin(angleRad) * this.debugDirectionRayLength);
        ctx.strokeStyle = 'red';
        ctx.clearRect(0,0,this.gameSettings.windowWidth,this.gameSettings.windowHeight);
        ctx.beginPath();
        ctx.moveTo(this.position.x,this.position.y);
        ctx.lineTo(endX,endY);
        ctx.stroke();
    };
    calculateDirectionAngle(){
        let style = window.getComputedStyle(this.playerSprite);
        let matrix = new DOMMatrix(style.transform); // Get transform matrix
        let angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI); // Convert radians to degrees
    
        this.directionAngle = angle - 90; // subtracting 90 deg cause our image faces upwards
    };
    shootAnimation(isFiring){
        if(isFiring){
            this.playerSprite.style.width = '95%';
            this.playerSprite.style.height = '95%';
        }
        else{
            this.playerSprite.style.width = '100%';
            this.playerSprite.style.height = '100%';
        };
    };
    changeRotationWithView(gameSettings){
        this.playerSprite.style.transform = `rotateZ(${this.gameSettings.sceneRotation}deg)`;
    };
};