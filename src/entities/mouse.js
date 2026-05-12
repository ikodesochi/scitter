// entities/mouse.js
import { Character } from '../core/character.js';

export class Mouse extends Character {
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
            // fallback на случай, если картинка не загрузилась
            super.drawDefault(ctx, "#aa8866", "🐭");
        }
    }
}