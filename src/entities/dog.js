// entities/dog.js
import { Character } from '../core/character.js';

export class Dog extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.fullness = 100;
        this.isProtecting = true;
        this.sleepImg = null;
        this.barkImg = null;
    }

    setImages(sleepImg, barkImg) {
        this.sleepImg = sleepImg;
        this.barkImg = barkImg;
    }

    updateFullness() {
        this.fullness = Math.max(0, this.fullness - 0.05);
        this.isProtecting = this.fullness > 0;
    }

    feed(amount = 20) {
        this.fullness = Math.min(100, this.fullness + amount);
        this.isProtecting = this.fullness > 0;
    }

    draw(ctx) {
        const img = this.isProtecting ? this.barkImg : this.sleepImg;
        if (img && img.complete) {
            ctx.drawImage(img, this.x, this.y, this.w, this.h);
        } else {
            // fallback на случай, если картинка не загрузилась
            super.drawDefault(ctx, this.isProtecting ? "#8B5A2B" : "#A0A0A0", this.isProtecting ? "🐕" : "💤");
        }
    }
}