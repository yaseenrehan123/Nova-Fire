export class LoadAssets {
    constructor() {
        this.assets = {
            player: "images/player.png",
            blueBattery: "images/batteries/blue_battery.png",
            greenBattery: "images/batteries/green_battery.png",
            purpleBattery: "images/batteries/purple_battery.png",
            yellowBattery: "images/batteries/yellow_battery.png",
            enemy1: "images/enemies/enemy1.png",
            enemy2: "images/enemies/enemy2.png",
            enemy3: "images/enemies/enemy3.png",
            greenBullet: "images/bullets/green_bullet.png",
            blueBullet:"images/bullets/blue_bullet.png",
            purpleBullet:"images/bullets/purple_bullet.png"


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
