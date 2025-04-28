import { Bodies,World,Body} from "matter-js";
export class CreateEntity{
    constructor(options){
        const{
            game = null,
            name = '',
            components = [],
        } = options;
        this.game = game;
        this.name = name;
        this.components = components;
        this.ecsEngine = this.game.ecs.entityEngine;
        this.matterEngine = this.game.matter.matterEngine;
        this.CreateEntity();
    };
    CreateEntity(){
        
        const id = this.ecsEngine.entity(this.name);

        for (const [key, value] of this.components) {
            id.setComponent(key, value);
        };

        this.createMatterBody(id);

        console.log(id);

        return id;

    };
    createMatterBody(entity) {
        if (!entity.hasComponent('matterBody')) return; // Only entities needing a body
        const matterBodyType = entity.getComponent('matterBodyType');
        const matterBodyOffset = entity.getComponent('matterBodyOffset') || { x: 0, y: 0 };
        const pos = entity.getComponent('pos') || { x: 0, y: 0 };
        const rotation = entity.getComponent('rotation') || 0;
        const matterBodyOptions = entity.getComponent('matterBodyOptions') || {}; // custom user options
        
        let body = null;
    
        switch (matterBodyType) {
            case 'rectangle':
                const width = entity.getComponent('matterBodyWidth');
                const height = entity.getComponent('matterBodyHeight');
                body = this.returnRectangleBody({
                    pos,
                    offset: matterBodyOffset,
                    width,
                    height,
                    advancedOptions: matterBodyOptions,
                    rotation: rotation * (Math.PI / 180) // 🔥 convert degrees to radians
                });
                break;
            
            // In future: add more like circle, polygon etc
        }
        console.log("Body is", body);
        if (body) {
            entity.setComponent('matterBody', body); // 👈 update the matterBody component
            World.add(this.matterEngine.world, body); // 👈 don't forget to add it to Matter.js world
            
        }
    }
    
    returnRectangleBody(options) {
        const {
            pos = { x: 0, y: 0 },
            offset = { x: 0, y: 0 },
            width = 100,
            height = 100,
            advancedOptions = {},
            rotation = 0,
        } = options;
    
        const body = Bodies.rectangle(
            pos.x + offset.x,
            pos.y + offset.y,
            width,
            height,
            {
                label: advancedOptions.label || '',
                frictionAir: advancedOptions.frictionAir || 0,
                isSensor: advancedOptions.isSensor ?? true,
                inertia: advancedOptions.inertia ?? Infinity,
                collisionFilter: {
                    group: advancedOptions.collisionFilter?.group ?? 0,
                    category: advancedOptions.collisionFilter?.category ?? 0x0001,
                    mask: advancedOptions.collisionFilter?.mask ?? 0xFFFF
                },
                ...advancedOptions // allow extra options to override too
            }
        );
        Body.setAngle(body, rotation);

        return body;
    }
    
}