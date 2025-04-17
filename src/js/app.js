import { GameSettings } from "./gameSettings.js";
import { Player } from "./player.js";
import { ChangeView } from "./changeview.js"
import { EnemySpawner } from "./enemySpawner.js";
import { Enemy1 } from "./enemyTypes.js";
import { ChangeBulletOrb,createChangeBulletOrb } from "./changeBullet.js";
import Matter from "matter-js";
start();

function start(){
    const gameSettings = new GameSettings();
    const player = new Player
({
    x:gameSettings.windowWidth/2,
    y:gameSettings.windowHeight/2
},
    gameSettings
);
const enemySpawner = new EnemySpawner(gameSettings);
const id = gameSettings.entityEngine.entity('dummyEntity');
id.setComponent('pos', {x: 200, y: 200});
id.setComponent('rotation', 0);
id.setComponent('aliveStatus', true);
id.setComponent('circleMatterBody', 40);
id.setComponent('matterBody', {position: {x: 200, y: 200}});
//const changeview = new ChangeView(-90,gameSettings,player.playerSprite);

//new ChangeBulletOrb(gameSettings,{x:player.position.x,y:0},'images/bulletChangeOrb/blueBulletOrb.png')
createChangeBulletOrb(gameSettings,{x:player.position.x,y:0},'images/bulletChangeOrb/blueBulletOrb.png',true);
player.playerInputListeners();
}

