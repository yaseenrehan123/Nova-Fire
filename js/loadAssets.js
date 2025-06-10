export class LoadAssets {
    constructor(callback) {
        this.callback = callback;

        this.loadAll();
    }

    fetchData(url) {
        return fetch(url)
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                throw new Error(error);
            })
    }
    loadImages() {
        return new Promise((resolve, reject) => {
            this.fetchData('data/imagesData.json')
                .then((data) => {
                    const keys = Object.keys(data);
                    const length = keys.length;
                    let loadCount = 0;
                    let images = {};

                    keys.forEach((key) => {
                        const img = new Image();
                        img.src = data[key];
                        images[key] = img;

                        img.onload = () => {
                            loadCount++;
                            if (loadCount === length) {
                                resolve(images);
                            }
                        };

                        img.onerror = () => {
                            reject(new Error(`Image failed to load ${data[key]}`));
                        }

                    });
                })
                .catch((error) => {
                    throw new Error(error);
                })
        });
    };
    loadAudio() {
        return new Promise((resolve, reject) => {
            this.fetchData('data/audioData.json')
                .then((data) => {
                    const keys = Object.keys(data);
                    const length = keys.length;
                    let loadCount = 0;
                    let audioObjects = {};

                    keys.forEach((key) => {
                        const audio = new Audio();
                        audio.src = data[key];
                        audio.preload = 'auto';
                        audioObjects[key] = audio;

                        // Try to preload by loading metadata
                        audio.onloadeddata = () => {
                            loadCount++;
                            if (loadCount === length) {
                                resolve(audioObjects);
                            }
                        };

                        audio.onerror = () => {
                            reject(new Error(`Audio failed to load: ${data[key]}`));
                        };
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    loadAll() {
        const imagesPromise = this.loadImages();
        const audioPromise = this.loadAudio();
        const entitiesPromise = this.fetchData('data/entitiesData.json');
        const settingsPromise = this.fetchData('data/settingsData.json');
        const enemyWavePromise = this.fetchData('data/enemyWaveData.json');
        const progressPromise = this.fetchData('data/progressData.json');
        Promise.all([imagesPromise, entitiesPromise, settingsPromise,audioPromise,enemyWavePromise,progressPromise])
            .then(([imagesData, entitiesData, settingsData,audioData,enemyWaveData,progressData]) => {
                const resources = {
                    imagesData: imagesData,
                    entitiesData: entitiesData,
                    settingsData: settingsData,
                    audioData: audioData,
                    enemyWaveData: enemyWaveData,
                    progressData: progressData
                }
                this.callback(resources);
            })
            .catch((error) => {
                console.error("Asset loading error:", error);
                throw error; // preserves original stack trace
            })
    }
}
