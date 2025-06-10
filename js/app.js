import { LoadAssets } from "./loadAssets.js";
import { Game } from "./game.js";
import { Player } from "./player.js";
import { Ui } from "./ui/ui.js";
const loader = new LoadAssets(start);

function start(resources) {
    console.log(resources);
    const game = new Game(resources);

    //game.player = new Player(game)
    //game.ui = new Ui(game);

    console.log('start called');
    console.log("PLAYER EXISTS?",game.gameUtils.entityExists(game.player.playerEntity));
};