import {Mouse} from './mouse.js';
import {Engine as EntityEngine,Simulator as EntitySimulator} from 'jecs';
import {Engine as MatterEngine,Runner as MatterRunner,Events} from 'matter-js'
export class Game{
    constructor(options){
        const {
            loadedImages = null,
        } = options;

        this.canvas = document.querySelector('.game-container');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.images = loadedImages;
        this.lastTime = 0;
        this.deltaTime = null;
        this.registeredObj = [];
        this.ecs = {
            entityEngine: null,
            entitySim: null,
        };
        this.matter = {
            matterEngine:null,
            matterRunner:null,
        }
        this.collisionCategories={
            playerCategory:0x0001,
            itemCategory:0x0002,
            playerBulletCategory:0x0004,
            enemyBulletCategory:0x0008
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.mouse = new Mouse(this);
       
        this.start();
        this.update();
    };
    start(){
        this.initializeJECS();
        this.initializeMatter();
        this.onResize();
        
        this.systemsJECS();
    };
    update(timeStamp){
        const deltaTime = (timeStamp - this.lastTime)/1000;
        this.lastTime = timeStamp;
        this.deltaTime = deltaTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawSprites()

        this.registeredObj.forEach((obj)=>{
            obj.update();
        });

        requestAnimationFrame(this.update.bind(this));
    };
    addObj(obj){
        this.registeredObj.push(obj);
    };
    drawImage({
        img,
        pos = { x: 0, y: 0 },
        width,
        height,
        centerImage = true,
        rotation = 0
      }) {
        const ctx = this.ctx;
        // local offsets
        const offsetX = centerImage ? -width  / 2 : 0;
        const offsetY = centerImage ? -height / 2 : 0;
      
        ctx.save();
        // 1) move origin to sprite pos
        ctx.translate(pos.x, pos.y);
        // 2) rotate around that origin
        ctx.rotate((rotation) * Math.PI / 180);
        // 3) draw relative to (0,0) — offset so your image is centered if desired
        ctx.drawImage(img, offsetX, offsetY, width, height);
        ctx.restore();
      }
      
    initializeJECS(){
        this.ecs.entityEngine = new EntityEngine();
        this.ecs.entitySim = new EntitySimulator(this.ecs.entityEngine);
        this.ecs.entitySim.setFps(60);
        this.ecs.entitySim.start();
    };
    onResize(){
        this.canvas.addEventListener('resize',()=>{
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        });
    }
    systemsJECS(){
        
    };
    drawSprites() {
        const req = ['imgKey','pos','width','height','rotation','centerImage'];
        const entities = Object.values(this.ecs.entityEngine.entities);
    
        for (let e of entities) {
          // only draw if it has every required component
          if (!req.every(c => e.hasComponent(c))) continue;
    
          // grab them out
          const imgKey      = e.getComponent('imgKey');
          const pos         = e.getComponent('pos');
          const width       = e.getComponent('width');
          const height      = e.getComponent('height');
          const rotation    = e.getComponent('rotation');
          const centerImage = e.getComponent('centerImage');
            
          // lookup your preloaded Image object
          const img = this.images[imgKey];
          if (!img) {
            console.warn(`No image for key "${imgKey}"`);
            continue;
          }
    
          // call your helper
          this.drawImage({
            img,
            pos,
            width,
            height,
            rotation,
            centerImage
          });
        }
      }
    initializeMatter(){

        this.matter.matterEngine = MatterEngine.create();
        this.matter.matterRunner = MatterRunner.create();
    
        
        this.matter.matterEngine.world.gravity.scale = 0;
        
        MatterRunner.run(this.matter.matterRunner,this.matter.matterEngine);
        this.collisionDetection();
       
    }
    collisionDetection(){
       Events.on(this.matter.matterEngine,'collisionStart',(event)=>{
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
    
    
    
}