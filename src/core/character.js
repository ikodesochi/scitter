// core/character.js
export class Character {
    constructor(x, y, w, h, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
    }

    move(dx, dy, map, tileSize, isSolidFn) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (!isSolidFn(newX, this.y, this.w, this.h, map, tileSize)) {
            this.x = newX;
        }
        if (!isSolidFn(this.x, newY, this.w, this.h, map, tileSize)) {
            this.y = newY;
        }
    }

    drawDefault(ctx, color, emoji) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "#ffffff";
        ctx.font = "26px monospace";
        ctx.fillText(emoji, this.x + 6, this.y + 22);
    }
}