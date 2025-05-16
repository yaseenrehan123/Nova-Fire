export class Button {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;

        this.backGroundColor = 'black';
        this.fontColor = 'white';
        this.fontStyle = 'Arial';
        this.fontSize = 20;
        this.fontHorizontalAlignment = 'center';
        this.fontVerticalAlignment = 'middle';
        this.fontText = 'testText';
        this.pos = { x: 0, y: 0 };
        this.width = 100;
        this.height = 100;
        this.isPressed = false;
        this.isHovered = false;
        this.onPress = null;
        this.onRelease = null;
        this.onHover = null;
        this.isVisible = true;

        this.start();
    };
    start() {
        this.init();
    }
    init() {
        const canvas = this.game.canvas;
        const activeListeners = ['touchstart', 'mousedown'];
        const unActiveListeners = ['touchend', 'mouseup'];
        const hoverListener = 'mousemove';

        activeListeners.forEach((eventName) => {
            canvas.addEventListener(eventName, () => {
                if(!this.isVisible) return;

                const mousePos = this.game.mouse.pos;
                const mouseX = mousePos.x;
                const mouseY = mousePos.y;
                if (this.isMouseOver(mouseX, mouseY)) {// check if it's pressing over btn
                    
                    this.isPressed = true;
                    
                    if (this.onPress) {
                        this.onPress();
                    }
                };
            }, { passive: true });
        });

        unActiveListeners.forEach(eventName => {
            canvas.addEventListener(eventName, () => {
                if(!this.isVisible) return;

                if (this.isPressed) {
                    this.isPressed = false;
                    if (this.onRelease) this.onRelease();
                }
            }, { passive: true });
        });

        canvas.addEventListener(hoverListener, () => {
            if(!this.isVisible) return;
            
            const mousePos = this.game.mouse.pos;
            const mouseX = mousePos.x;
            const mouseY = mousePos.y;
            if (this.isMouseOver(mouseX, mouseY)) {
                canvas.style.cursor = 'pointer';
                this.hovered = true;
            } else {
                canvas.style.cursor = 'default';
                this.hovered = false;
            }
        });
    };
    draw() {
        if(!this.isVisible) return;

        const ctx = this.ctx;

        const x = this.pos.x;
        const y = this.pos.y;
        const w = this.width;
        const h = this.height;
        const bgColor = this.backGroundColor;
        const fSize = this.fontSize;
        const fStyle = this.fontStyle;
        const fColor = this.fontColor;
        const fText = this.fontText;
        const xAlignment = this.fontHorizontalAlignment;
        const yAlignment = this.fontVerticalAlignment;
        const textX = this.textAlignmentHorizontal(x, w, xAlignment)
        const textY = this.textAlignmentVertical(y, h, yAlignment);
        ctx.save();

        //background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);

        //font
        ctx.textAlign = xAlignment;
        ctx.textBaseline = yAlignment;
        ctx.font = `${fSize}px ${fStyle}`;
        ctx.fillStyle = fColor;
        ctx.fillText(fText, textX, textY);
        ctx.restore();
    };
    setBackgroundColor(newColor) {
        this.backGroundColor = newColor;
    };
    setFontColor(newColor) {
        this.fontColor = newColor;
    };
    setFontStyle(newStyle) {
        this.fontStyle = newStyle;
    };
    setFontSize(newSize) {
        this.fontSize = newSize;
    };
    setFontHorizontalAlignment(newAlignment) {
        this.fontHorizontalAlignment = newAlignment;
    };
    setFontVerticalAlignment(newAlignment) {
        this.fontVerticalAlignment = newAlignment;
    };
    setFontText(newText) {
        this.fontText = newText;
    }
    setPos(newPos) {
        this.pos = newPos;
    };
    setWidth(newWidth) {
        this.width = newWidth;
    };
    setHeight(newHeight) {
        this.height = newHeight;
    };
    setIsVisible(bool){
        this.isVisible = bool;
    }
    setOnPress(callback) {
        this.onPress = callback;
    };
    setOnRelease(callback) {
        this.onRelease = callback;
    };
    textAlignmentHorizontal(x, w, xAlignment) {
        let textX = null;
        if (xAlignment === 'left') {
            textX = x;
        }
        else if (xAlignment === 'center') {
            textX = x + w / 2;
        }
        else if (xAlignment === 'right') {
            textX = x + w;
        };
        return textX;
    };
    textAlignmentVertical(y, h, yAlignment) {
        let textY = null;
        if (yAlignment === 'top') {
            textY = y;
        }
        else if (yAlignment === 'middle') {
            textY = y + h / 2;
        }
        else if (yAlignment === 'bottom') {
            textY = y + h
        };
        return textY;
    };
    returnIsPressed() {
        return this.isPressed;
    };
    returnIsHovered() {
        return this.isHovered;
    };
    returnIsVisible(){
        return this.isVisible;
    };
    isMouseOver(mouseX, mouseY) {
        return (
            mouseX >= this.pos.x &&
            mouseX <= this.pos.x + this.width &&
            mouseY >= this.pos.y &&
            mouseY <= this.pos.y + this.height
        );
    };

}