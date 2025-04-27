export class LoadAssets {
    constructor() {
        this.assets = {
            player: "images/player.png"
        };
        this.loadedImages = {};
        this.loadedCount = 0;
    }

    preloadImages(callback) {
        const total = Object.keys(this.assets).length;

        for (let key in this.assets) {
            const img = new Image();
            img.src = this.assets[key];

            img.onload = () => {
                this.loadedImages[key] = img;
                this.loadedCount++;

                if (this.loadedCount === total) {
                    callback(this.loadedImages);
                }
            };

            img.onerror = (e) => {
                console.error(`Failed to load image: ${img.src}`);
            };
        }
    }
}
