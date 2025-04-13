import { Enemy } from "./enemy.js";

export class Enemy1 extends Enemy{
    constructor(gameSettings,position){
        super(gameSettings,position,1,1,'images/enemies/enemy1.png');
    };
    createMatterBody() {
        
        // Create the physics body
        this.body = Matter.Bodies.rectangle(
            this.position.x, this.position.y,
            this.width, this.height,
            {
                label: 'enemy',
                frictionAir: 0,
                isSensor: false,      // Still collides
                collisionFilter: { group: 0 },
                inertia: Infinity,    // Prevent rotation
                collisionFilter: {
                    group: 0, 
                    category: this.gameSettings.CATEGORY_ENEMY,
                    mask: this.gameSettings.CATEGORY_BULLET
                },
            }
        );

        // Disable gravity (by applying zero gravity to just this body)
        this.body.plugin = { noGravity: true };

        // Add to world
        Matter.World.add(this.gameSettings.engine.world, this.body);

        // Set initial velocity
       
    };
    draw(ctx) { 
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
};

export class Enemy2 extends Enemy{
    constructor(gameSettings,position){
        super(gameSettings,position,3,0.5,'images/enemies/enemy2.png');
    };
    createMatterBody() {
        
        // Create the physics body
        this.body = Matter.Bodies.rectangle(
            this.position.x, this.position.y,
            this.width, this.height,
            {
                label: 'enemy',
                frictionAir: 0,
                isSensor: false,     
                collisionFilter: { group: 0 },
                inertia: Infinity,   
                collisionFilter: {
                    group: 0, 
                    category: this.gameSettings.CATEGORY_ENEMY,
                    mask: this.gameSettings.CATEGORY_BULLET
                },
            }
        );

        // Disable gravity (by applying zero gravity to just this body)
        this.body.plugin = { noGravity: true };

        // Add to world
        Matter.World.add(this.gameSettings.engine.world, this.body);

        // Set initial velocity
        
    };
    draw(ctx) { 
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
};
export class Enemy3 extends Enemy{
    constructor(gameSettings,position){
        super(gameSettings,position,0.5,1.5,'images/enemies/enemy3.png');
    };
    createMatterBody() {
        
        // Create the physics body
        this.body = Matter.Bodies.rectangle(
            this.position.x, this.position.y,
            this.width, this.height,
            {
                label: 'enemy',
                frictionAir: 0,
                isSensor: false,      // Still collides
                collisionFilter: { group: 0 },
                inertia: Infinity,    // Prevent rotation
                collisionFilter: {
                    group: 0, 
                    category: this.gameSettings.CATEGORY_ENEMY,
                    mask: this.gameSettings.CATEGORY_BULLET
                },
            }
        );

        // Disable gravity (by applying zero gravity to just this body)
        this.body.plugin = { noGravity: true };

        // Add to world
        Matter.World.add(this.gameSettings.engine.world, this.body);

        // Set initial velocity
        
    };
    draw(ctx) { 
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
};