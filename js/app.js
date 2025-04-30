import { LoadAssets } from "./loadAssets.js";
import { Game } from "./game.js";
import { CreateEntity } from "./createEntity.js";
import { ChangeView } from "./changeview.js";
const loader = new LoadAssets();
loader.preloadImages((images) => {
    start(images);
    
});
function start(images){
    const options = {
        loadedImages: images,
    }
    const game = new Game(options);
    new CreateEntity({
        game:game,
        name:'testEntity',
        components:[
            ['imgKey','player'],
            ['pos',{x:500,y:500}],
            ['width',100],
            ['height',100],
            ['rotation',0],
            ['centerImage',true],
            ['sceneOrientedRotation',true],// a flag to change rotation with scene
            ['matterBody',null],// assigned on creation
            ['matterBodyType','rectangle'],
            ['matterBodyOffset',{x:0,y:-6}],
            ['matterBodyWidth',100],
            ['matterBodyHeight',70],
            ['matterBodyOptions',{
                label: 'player',
                isSensor: true,
                frictionAir: 0.05,
                collisionFilter: {
                    group: 0,
                    category: game.collisionCategories.playerCategory,
                    mask: game.collisionCategories.itemCategory | game.collisionCategories.enemyCategory,
                }
            }],
            ['matterBodyColor','white'],
            ['baseRotation',0],
            ['moveVector',{x:0,y:0}],
            ['speed',30],
            ['player',true]
        ]
    })
    /*
    new ChangeView({
        newRotation:190,
        game:game
    });
    */
    console.log('start called');
};