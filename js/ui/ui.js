import { MainMenuUi } from "./mainMenuUi.js";
import { PlayerUi } from "./playerUi.js";
import { PauseUi } from "./pauseUi.js";
import { SettingsSceneUi } from "./settingsSceneUi.js";
import { ControlsSceneUi } from "./controlsSceneUi.js";
import { GameoverUi } from "./gameoverUi.js";
import { GamewinUi } from "./gamewinUi.js";
export class Ui {
    constructor(game) {
        this.game = game;

        this.mainMenuUi = new MainMenuUi(game);
        this.settingsSceneUi = new SettingsSceneUi(game);
        this.controlsSceneUi = new ControlsSceneUi(game);
        this.playerUi = new PlayerUi(game);
        this.pauseUi = new PauseUi(game);
        this.gameoverUi = new GameoverUi(game);
        this.gamewinUi = new GamewinUi(game);
    };
};


