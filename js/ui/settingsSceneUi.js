export class SettingsSceneUi {
    constructor(game) {
        this.game = game;
        this.gameUtils = game.gameUtils;

        this.musicCheckboxEntity = null;
        this.musicCheckboxTextEntity = null;
        this.sfxCheckboxEntity = null;
        this.sfxCheckboxTextEntity = null;
        this.backBtnEntity = null;
        this.backBtnTextEntity = null;
        this.controlsBtnEntity = null;
        this.controlsTextEntity = null;

        this.start();
    };
    start() {
        this.initMusicCheckbox();
        this.initMusicCheckboxText();
        this.initSfxCheckbox();
        this.initSfxCheckboxText();
        this.initBackBtnEntity();
        this.initBackBtnTextEntity();
        this.initControlsBtnEntity();
        this.initControlsTextEntity();

    };
    initMusicCheckbox() {
        const btnColor = 'rgb(27, 59, 106)';
        this.musicCheckboxEntity = this.gameUtils.spawnEntity({
            passedKey: 'checkboxButton',
            componentsToModify: {
                parent: this.game.settingsSceneEntity,
                width: 200,
                height: 100,
                shapeColor: btnColor,
                checkbox: {
                    storageKey: 'music'
                },
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        const newValue = this.gameUtils.toggleCheckbox(this.musicCheckboxEntity);
                        const musicCheckBoxStorageKey = this.gameUtils.returnCheckboxStorageKey(this.musicCheckboxEntity);
                        this.game.settingsStorageManager.setProperty(musicCheckBoxStorageKey, newValue);
                        this.toggleMusicCheckboxText();
                        this.gameUtils.playSfx('buttonClick');
                        if (newValue === true) {
                            this.gameUtils.playLoopedMusic('backgroundMusic');
                        }
                        else {
                            this.game.soundManager.stopAllLoops();
                        }

                        console.log("SETTINGS PROPERTY STATE:", this.game.settingsStorageManager.getProperty('music'));
                        console.log("MUSIC CHECKBOX STATE:", this.musicCheckboxEntity.getComponent('checkbox'));
                    }
                },
                anchoring: {
                    anchorY: 'top',
                    offsetY: 50
                }

            }
        });
        this.gameUtils.retrieveSavedCheckboxData(this.musicCheckboxEntity, this.game.settingsStorageManager);
        this.gameUtils.anchorEntity(this.musicCheckboxEntity, this.game.settingsSceneEntity);

        console.log("MUSIC CHECKBOX STATE:", this.musicCheckboxEntity.getComponent('checkbox'));
    };
    initMusicCheckboxText() {
        this.musicCheckboxTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontContent: 'Music:ON',
                parent: this.musicCheckboxEntity,
                fontSize: 30
            }
        });
        this.gameUtils.anchorEntity(this.musicCheckboxTextEntity, this.musicCheckboxEntity);
        this.toggleMusicCheckboxText();
    };
    toggleMusicCheckboxText() {
        this.gameUtils.toggleFontContentOnCheckbox(
            this.musicCheckboxEntity,
            this.musicCheckboxTextEntity,
            'Music: On',
            'Music: Off'
        );
    };
    initSfxCheckbox() {
        const btnColor = 'rgb(27, 59, 106)';
        this.sfxCheckboxEntity = this.gameUtils.spawnEntity({
            passedKey: 'checkboxButton',
            componentsToModify: {
                parent: this.game.settingsSceneEntity,
                width: 200,
                height: 100,
                shapeColor: btnColor,
                checkbox: {
                    storageKey: 'sfx'
                },
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        const newValue = this.gameUtils.toggleCheckbox(this.sfxCheckboxEntity);
                        const sfxCheckBoxStorageKey = this.gameUtils.returnCheckboxStorageKey(this.sfxCheckboxEntity);
                        this.game.settingsStorageManager.setProperty(sfxCheckBoxStorageKey, newValue);
                        this.toggleSfxCheckboxText();
                        this.gameUtils.playSfx('buttonClick');
                        console.log("SETTINGS PROPERTY STATE:", this.game.settingsStorageManager.getProperty('sfx'));
                        console.log("SFX CHECKBOX STATE:", this.sfxCheckboxEntity.getComponent('checkbox'));
                    }
                },
                anchoring: {
                    anchorY: top,
                    offsetY: 200
                }
            }
        });

        this.gameUtils.retrieveSavedCheckboxData(this.sfxCheckboxEntity, this.game.settingsStorageManager);
        this.gameUtils.anchorEntity(this.sfxCheckboxEntity, this.game.settingsSceneEntity);

        console.log("SFX CHECKBOX STATE:", this.sfxCheckboxEntity.getComponent('checkbox'));
    };
    initSfxCheckboxText() {
        this.sfxCheckboxTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontContent: 'SFX: ON',
                parent: this.sfxCheckboxEntity,
                fontSize: 30
            }
        });

        this.gameUtils.anchorEntity(this.sfxCheckboxTextEntity, this.sfxCheckboxEntity);
        this.toggleSfxCheckboxText();
    };
    toggleSfxCheckboxText() {
        this.gameUtils.toggleFontContentOnCheckbox(
            this.sfxCheckboxEntity,
            this.sfxCheckboxTextEntity,
            'SFX: On',
            'SFX: Off'
        );
    };
    refreshCheckboxStates() {
        this.gameUtils.retrieveSavedCheckboxData(this.musicCheckboxEntity, this.game.settingsStorageManager);
        this.toggleMusicCheckboxText();

        this.gameUtils.retrieveSavedCheckboxData(this.sfxCheckboxEntity, this.game.settingsStorageManager);
        this.toggleSfxCheckboxText();
    };
    initBackBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)';
        this.backBtnEntity = this.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                anchoring: {
                    anchorX: 'right',
                    anchorY: 'top'
                },
                parent: this.game.settingsSceneEntity,
                shapeColor: btnColor,
                width: 200,
                height: 100,
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        this.gameUtils.loadScene(this.game.mainMenuSceneEntity);
                        this.gameUtils.playSfx('buttonClick');
                    }
                }
            }
        });
        this.gameUtils.anchorEntity(this.backBtnEntity, this.game.settingsSceneEntity);
    };
    initBackBtnTextEntity() {
        this.backBtnTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'BACK',
                parent: this.backBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.backBtnTextEntity, this.backBtnEntity);
    };
    initControlsBtnEntity() {
        const btnColor = 'rgb(27, 59, 106)';
        this.controlsBtnEntity = this.gameUtils.spawnEntity({
            passedKey: 'button',
            componentsToModify: {
                anchoring: {
                   offsetY:-150
                },
                parent: this.game.settingsSceneEntity,
                shapeColor: btnColor,
                width: 200,
                height: 100,
                button: {
                    clickBoxWidth: 200,
                    onPress: () => {
                        this.gameUtils.loadScene(this.game.controlsSceneEntity);
                        this.gameUtils.playSfx('buttonClick');
                    }
                }
            }
        });
        this.gameUtils.anchorEntity(this.controlsBtnEntity, this.game.settingsSceneEntity);
    };
    initControlsTextEntity() {
         this.controlsTextEntity = this.gameUtils.spawnEntity({
            passedKey: 'text',
            componentsToModify: {
                fontSize: 30,
                fontContent: 'CONTROLS',
                parent: this.controlsBtnEntity
            }
        });
        this.gameUtils.anchorEntity(this.controlsTextEntity, this.controlsBtnEntity);
    };
}