// entities/cat.js
import { Character } from '../core/character.js';

export class Cat extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.image = null;
    }

    setImage(img) {
        this.image = img;
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        } else {
            super.drawDefault(ctx, "#2a6a2a", "🐱");
        }
    }
}