import Matter from "matter-js";
import { Engine, Simulator } from 'jecs';

export class GameSettings{
    //isMobile;
    
    //#region windowSettings
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    //#endregion

    //#region calculateDeltaTime
    deltaTime;
    lastTime = 0;
    //#endregion

    //#region objectsArray
    objects = [];
    //#endregion

    //#region canvas
    canvas;
    ctx;
    //#endregion

    //#region generalRotationTracker
    sceneRotation = 0; // 0 by def straight scene
    //#endregion

    //#region matterJS
    engine = null;
    //render = null;
    runner = null;
    CATEGORY_PLAYER = 0x0001;
    CATEGORY_BULLET = 0x0002;
    CATEGORY_ENEMY = 0x0004;
    CATEGORY_ITEM = 0x0008;
    //#endregion

    //#region drawing
    draw = true;
    //#endregion

    //#region ecs
    entityEngine = null;
    entitySim = null;
    //#endregion

    constructor(){
        this.start();
        this.gameLoop(0);
    };
    /*
    checkIfMobile(){
        let details = navigator.userAgent;
        let regexp = /android|iphone|kindle|ipad/i; 
        this.isMobile = regexp.test(details);
    };
    checkIfMobileListener(){
        window.addEventListener('resize',() => this.checkIfMobile)
    };
    */

   start(){
        //this.checkIfMobile();
        //this.checkIfMobileListener();
        this.initializeCanvas();
        this.initializeMatterLib();
        this.initializeJECS();
        this.onWindowResize();
   }
   gameLoop(timeStamp){
    const deltaTime = (timeStamp - this.lastTime)/1000;
    this.lastTime = timeStamp;
    this.deltaTime = deltaTime;
    this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    this.drawMatterBodies();

    this.objects.forEach(obj => obj.update(this.deltaTime));
    requestAnimationFrame(this.gameLoop.bind(this));
   };

   registerObject(obj){
    if(this.objects.includes(obj))
        return;
    this.objects.push(obj);
   };

   initializeCanvas(){
    this.canvas = document.querySelector('.game-container');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
   };
   resizeCanvas(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Optional: force re-setting CSS to match just in case
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
   }
   onWindowResize(){
    window.addEventListener('resize',()=>{
        this.windowWidth =  window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.resizeCanvas();
        //this.setRenderSize();
    });
   };
   initializeMatterLib(){
    
    this.engine = Matter.Engine.create();
    /*
    this.render = Matter.Render.create({
        engine:this.engine,
        element:document.body,
        wireframes: false,
    });
    */
    this.runner = Matter.Runner.create();

    //this.setRenderSize();
    this.engine.world.gravity.scale = 0;
    
    Matter.Runner.run(this.runner,this.engine);
    //Matter.Render.run(this.render);
    this.collisionDetection();
   };
   /*
   setRenderSize(){
    Matter.Render.setSize(this.render,this.windowWidth,this.windowHeight);
   };
   */

   collisionDetection(){
    Matter.Events.on(this.engine,'collisionStart',(event)=>{
        for (let pair of event.pairs){
            const {bodyA,bodyB} = pair;
            const a = bodyA.label;
            const b = bodyB.label;
            if(this.matchCollision(a,b,'playerBullet','enemy')){
                // subtract enemy hp
                const bullet = bodyA.label === 'playerBullet' ? bodyA.gameObject : bodyB.gameObject;
                const enemy = bodyB.label === 'enemy' ? bodyB.gameObject : bodyA.gameObject;
                enemy.takeDamage(bullet.damage);
                bullet.die();
            }
            else if(this.matchCollision(a,b,'player','enemy')){
                // subtract player hp and give invincibility frames
                // destroy enemy
                console.log("Player collided with enemy");
            }
            else if(this.matchCollision(a,b,'player','item')){
                console.log("Player collided with an item!");
            }
        };
        
        
    });
   };
   matchCollision(a, b, label1, label2) {
    return (a === label1 && b === label2) || (a === label2 && b === label1);
    };
    initializeJECS(){
        this.entityEngine = new Engine();
        this.entitySim = new Simulator(this.entityEngine);
        this.entitySim.setFps(60);
        this.entitySim.start();
        this.initializeSystems();
        console.log(this.entityEngine);
    };
    initializeSystems(){
        this.moveSystem();
    };
    moveSystem(){
        this.entityEngine.system('move',['pos','speed','rotation','aliveStatus','element','matterBody'],(entity,{pos,speed,rotation,aliveStatus,element,matterBody})=>{
            const angleRad = (rotation - 90) * (Math.PI / 180);
            Matter.Body.setVelocity(matterBody, {
                x: Math.cos(angleRad) * speed,
                y: Math.sin(angleRad) * speed
            });
             // Move bullet in direction
             pos.x = matterBody.position.x;
             pos.y = matterBody.position.y;
     
             element.style.left = `${pos.x}px`;
             element.style.top = `${pos.y}px`;
     
             // Optional: destroy enemy if out of screen
             const buffer = 100;
             if (
                pos.x < -buffer || pos.x > window.innerWidth + buffer ||
                pos.y < -buffer || pos.y > window.innerHeight + buffer
            ) {
               aliveStatus = false;
            };
        });
    };
    drawMatterBodies(){
        const entities = this.entityEngine.entities;

        for (const key in entities) {
            const entity = entities[key];
            if (!entity || typeof entity.hasComponent !== 'function') continue;
    
            if (entity.hasComponent('circleMatterBodyRadius')) {
                this.drawCircleMatterBody(entity);
            } else if (entity.hasComponent('rectMatterBodyBounds')) {
                this.drawRectMatterBody(entity);
            }
        }
    };
    drawCircleMatterBody(entity){
        const ctx = this.ctx;
        const pos = entity.getComponent('pos');
        const rotation = entity.getComponent('rotation');
        const aliveStatus = entity.getComponent('aliveStatus');
        const radius = entity.getComponent('circleMatterBodyRadius');
        const offset = entity.getComponent('matterBodyOffset');

        if(!aliveStatus) return;
        ctx.save();
        ctx.translate(pos.x + offset.x, pos.y + offset.y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        
    };
    drawRectMatterBody(entity){
        const ctx = this.ctx;
        const pos = entity.getComponent('pos');
        const rotation = entity.getComponent('rotation');
        const aliveStatus = entity.getComponent('aliveStatus');
        const bounds = entity.getComponent('rectMatterBodyBounds');
        const offset = entity.getComponent('matterBodyOffset');

        if(!aliveStatus) return;
        ctx.save();
        ctx.translate(pos.x + offset.x, pos.y + offset.y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.fillStyle = 'white';
        ctx.fillRect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
        ctx.restore();
    };

};