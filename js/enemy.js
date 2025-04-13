export class Enemy{
    constructor(gameSettings,position,health,speed,imgSrc){
        this.gameSettings = gameSettings;
        this.position = {x:position.x,y:position.y};
        this.health = health;
        this.speed = speed;
        this.imgSrc = imgSrc;
        this.rotation = gameSettings.sceneRotation -180;
        this.width = 100;
        this.height = 100;
        this.element = null;
        this.elementSprite = null;
        this.body = null;
        this.dead = false;
        this.start();
    };
    start(){
        this.gameSettings.registerObject(this);
        this.createElement();
        this.createMatterBody();
        this.body.gameObject = this;
    };
    update(deltaTime){
        this.changeRotationWithView();
        this.move(deltaTime);
        if(this.gameSettings.draw && !this.dead){
            this.draw(this.gameSettings.ctx);
        };
        
    };
    createElement(){
        this.element = document.createElement('div');
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.transform = `translate(-50%,-50%)`;
        this.element.style.left =  `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.position = 'absolute';

        this.sprite = document.createElement('img');
        this.sprite.style.width = `100%`;
        this.sprite.style.height = `100%`;
        this.sprite.src = this.imgSrc;
        this.sprite.style.transform = `rotateZ(${this.rotation}deg)`;
        this.sprite.draggable = false;

        this.element.append(this.sprite);
        document.body.append(this.element);
    };
    changeRotationWithView(){
        this.rotation = this.gameSettings.sceneRotation - 180;
        this.sprite.style.transform = `rotateZ(${this.rotation}deg)`;
    };
    move(deltaTime){
         // Convert degrees to radians
         const angleRad = (this.rotation - 90) * (Math.PI / 180);

         Matter.Body.setVelocity(this.body, {
            x: Math.cos(angleRad) * this.speed,
            y: Math.sin(angleRad) * this.speed
        });
         // Move bullet in direction
         this.position.x = this.body.position.x;
         this.position.y = this.body.position.y;
 
         this.element.style.left = `${this.position.x}px`;
         this.element.style.top = `${this.position.y}px`;
 
         // Optional: destroy enemy if out of screen
         const buffer = 100;
         if (
            this.position.x < -buffer || this.position.x > window.innerWidth + buffer ||
            this.position.y < -buffer || this.position.y > window.innerHeight + buffer
        ) {
            this.die();
        };
    };
    takeDamage(damage){
        this.health -= damage;
        if(this.health <= 0){
            this.die();
        };
    };
    die(){
        this.dead = true;
        Matter.World.remove(this.gameSettings.engine.world, this.body);
        this.element.remove();
    };
};