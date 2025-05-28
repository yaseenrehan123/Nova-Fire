export class SoundManager {
    constructor(audioData) {
        this.audioData = audioData;
        this.currentLoops = new Set(); // track looping sounds
    }

    play(key) {
        const sound = this.audioData[key];
        if (sound) {
            sound.currentTime = 0; // rewind to start
            sound.play();
        }
        else{
            throw new Error(`SOUND FILE NOT IN AUDIO DATA!!, ${key}`);
        }
    }

    loop(key) {
        const sound = this.audioData[key];
        if (sound) {
            sound.loop = true;
            sound.play();
        }
        this.currentLoops.add(key);
    }

    stop(key) {
        const sound = this.audioData[key];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
        this.currentLoops.delete(key);
    }

    stopAllLoops() {
        for (const key of this.currentLoops) {
            this.stop(key);
        }
    }
    
    setVolume(key, volume) {
        const sound = this.audioData[key];
        if (sound) {
            sound.volume = volume;
        }
    }
}
