import { Bullet } from "./bullet.js";

export class GreenBullet extends Bullet{
    constructor(startingPos,direction,gameSettings){
        super(startingPos,direction,8,gameSettings,'images/bullets/GreenBullet.png',0.5,1);
    };
    draw(ctx) { 
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
};
export class BlueBullet extends Bullet {
    constructor(startingPos, direction, gameSettings) {
        super(startingPos, direction,11, gameSettings, 'images/bullets/BlueBullet.png',0.2,0.5);
    }
    createMatterBody(){
        // Create the physics body
        this.body = Matter.Bodies.circle(
           this.pos.x +2, this.pos.y -6.5,
           15,
           {
               label: 'playerBullet',
               frictionAir: 0,
               isSensor: false,      // Still collides
               collisionFilter: { group: 0 },
               inertia: Infinity,    // Prevent rotation
               collisionFilter: {
                   group: -1, // prevents bullets colliding with each other
                   category: this.gameSettings.CATEGORY_BULLET,
                   mask: this.gameSettings.CATEGORY_ENEMY // bullets only collide with enemies
               },

           }
       );

       // Disable gravity (by applying zero gravity to just this body)
       
       // Add to world
       Matter.World.add(this.gameSettings.engine.world, this.body);
   };
   draw(ctx) { 
    ctx.save();
    ctx.translate(this.pos.x +2, this.pos.y -6.5);
    ctx.rotate(this.rotation * Math.PI / 180);

    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2); // x=0, y=0 after translate
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}
}

export class PurpleBullet extends Bullet {
    constructor(startingPos, direction, gameSettings) {
        super(startingPos, direction, 5, gameSettings, 'images/bullets/PurpleBullet.png',1,3);
    }
    createMatterBody(){
        // Create the physics body
        this.body = Matter.Bodies.rectangle(
           this.pos.x, this.pos.y,
           100, 23,
           {
               label: 'playerBullet',
               frictionAir: 0,
               isSensor: false,      // Still collides
               collisionFilter: { group: 0 },
               inertia: Infinity,    // Prevent rotation
               collisionFilter: {
                   group: -1, // prevents bullets colliding with each other
                   category: this.gameSettings.CATEGORY_BULLET,
                   mask: this.gameSettings.CATEGORY_ENEMY // bullets only collide with enemies
               },

           }
       );

       // Disable gravity (by applying zero gravity to just this body)
       
       // Add to world
       Matter.World.add(this.gameSettings.engine.world, this.body);
   };
    draw(ctx) { 
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width / 2, -this.height / 2, 100,23);
        ctx.restore();
    }
}