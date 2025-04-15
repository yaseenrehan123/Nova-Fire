import Matter from "matter-js";
export class ChangeBulletOrb{
    constructor(gameSettings,pos={x,y},imageSrc){
        this.gameSettings = gameSettings;
        this.bodyRadius = 25;
        this.dead = false;
        this.body = null;
        this.element = null;
        this.imageSrc = imageSrc;
        this.pos = pos;
        this.speed = 5;
        this.rotation = gameSettings.sceneRotation - 180;
        this.width = 50;
        this.height = 50;
        this.start();
    };
    start(){
        this.gameSettings.registerObject(this);
        this.createElement();
        this.createMatterBody();
        this.body.gameObject = this;
    };
    update(delta){
        this.move();
        this.draw(this.gameSettings.ctx);
    }
    move(){
        const angleRad = (this.rotation - 90) * (Math.PI / 180);

         Matter.Body.setVelocity(this.body, {
            x: Math.cos(angleRad) * this.speed,
            y: Math.sin(angleRad) * this.speed
        });
         // Move bullet in direction
         this.pos.x = this.body.position.x;
         this.pos.y = this.body.position.y;
 
         this.element.style.left = `${this.pos.x}px`;
         this.element.style.top = `${this.pos.y}px`;
 
         // Optional: destroy enemy if out of screen
         const buffer = 100;
         if (
            this.pos.x < -buffer || this.pos.x > window.innerWidth + buffer ||
            this.pos.y < -buffer || this.pos.y > window.innerHeight + buffer
        ) {
            this.die();
        };
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
    createMatterBody(){
        // Create the physics body
        this.body = Matter.Bodies.circle(
           this.pos.x, this.pos.y,
           15,
           {
               label: 'item',
               frictionAir: 0,
               isSensor: false,      // Still collides
               collisionFilter: { group: 0 },
               inertia: Infinity,    // Prevent rotation
               collisionFilter: {
                   group: -1, 
                   category: this.gameSettings.CATEGORY_ITEM,
                   mask: this.gameSettings.CATEGORY_PLAYER
               },

           }
       );
       Matter.World.add(this.gameSettings.engine.world, this.body);
   };
    draw(ctx){
        if(this.gameSettings.draw && !this.dead){
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.beginPath();
            ctx.arc(0, 0, this.bodyRadius, 0, Math.PI * 2); // x=0, y=0 after translate
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        };
    };
    die(){
        this.dead = true;
        this.element.remove();
        Matter.World.remove(this.gameSettings.engine.world, this.body);
    };
};