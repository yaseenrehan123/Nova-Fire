import { MainMenuUi } from "./mainMenuUi.js";
import { PlayerUi } from "./playerUi.js";
import { PauseUi } from "./pauseUi.js";
import { SettingsSceneUi } from "./settingsSceneUi.js";
export class Ui {
    constructor(game) {
        this.game = game;

        this.mainMenuUi = new MainMenuUi(game);
        this.settingsSceneUi = new SettingsSceneUi(game);
        this.playerUi = new PlayerUi(game);
        this.pauseUi = new PauseUi(game);
    };
};


