export class Bullet{
    constructor(startingPos,direction,speed,gameSettings,imageSrc,fireDelayInSeconds,damage){
        this.pos = {x:startingPos.x,y:startingPos.y};
        this.direction = direction - 90;
        this.rotation = direction;
        this.speed = speed;
        this.gameSettings = gameSettings;
        this.element = null;
        this.sprite = null;
        this.width = 100;
        this.height = 100;
        this.imageSrc = imageSrc;
        this.fireDelayInSeconds = fireDelayInSeconds;
        this.damage = damage;
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
        // Convert degrees to radians
        const angleRad = this.direction * (Math.PI / 180);

        // Move bullet in direction
       // Set initial velocity
        Matter.Body.setVelocity(this.body, {
            x: Math.cos(angleRad) * this.speed,
            y: Math.sin(angleRad) * this.speed
        });
        this.pos.x = this.body.position.x;
        this.pos.y = this.body.position.y;

        this.element.style.left = `${this.pos.x}px`;
        this.element.style.top = `${this.pos.y}px`;

        const buffer = 100;

        if (
            this.pos.x < -buffer || this.pos.x > window.innerWidth + buffer ||
            this.pos.y < -buffer || this.pos.y > window.innerHeight + buffer
        ) {
            this.die();
        } else {
            if (this.gameSettings.draw && !this.dead) {
                this.draw(this.gameSettings.ctx);
            }
        }
        
    };
    createElement(){
        this.element = document.createElement('div');
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.transform = `translate(-50%,-50%)`;
        this.element.style.left =  `${this.pos.x}px`;
        this.element.style.top = `${this.pos.y}px`;
        this.element.style.position = 'absolute';

        this.sprite = document.createElement('img');
        this.sprite.style.width = `100%`;
        this.sprite.style.height = `100%`;
        this.sprite.src = this.imageSrc;
        this.sprite.style.transform = `rotateZ(${this.rotation}deg)`;
        this.sprite.draggable = false;

        this.element.append(this.sprite);
        document.body.append(this.element);
    };
    die(){
        this.dead = true;
        Matter.World.remove(this.gameSettings.engine.world, this.body);
        this.element.remove();
    };
};