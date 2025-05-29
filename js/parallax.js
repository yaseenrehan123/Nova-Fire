export class Parallax {
    constructor(img, scrollSpeed, direction = 'vertical') {
        this.img = img;
        this.scrollSpeed = scrollSpeed;
        this.direction = direction;

        // Determine image dimensions
        this.width = img.width;
        this.height = img.height;

        // Position two layers for seamless looping
        this.positions = [
            { x: 0, y: 0 },
            { x: 0, y: direction === 'vertical' ? this.height : this.width }
        ];
    }

    run(ctx) {
        for (const pos of this.positions) {
            ctx.drawImage(this.img, Math.round(pos.x), Math.round(pos.y));
        }

        // Update positions
        if (this.direction === 'vertical') {
            this.positions.forEach(pos => pos.y -= this.scrollSpeed);

            // Reset if image goes off screen
            this._resetPosition('y', this.height);
        } else {
            this.positions.forEach(pos => pos.x -= this.scrollSpeed);
            this._resetPosition('x', this.width);
        }
    }

    _resetPosition(axis, size) {
        const [first, second] = this.positions;

        if (first[axis] <= -size) {
            first[axis] = second[axis] + size - this.scrollSpeed;
        }
        if (second[axis] <= -size) {
            second[axis] = first[axis] + size - this.scrollSpeed;
        }
    }
}
