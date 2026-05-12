// core/character.js
export class Character {
    constructor(x, y, w, h, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.baseSpeed = speed;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    drawDefault(ctx, color, emoji) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "#ffffff";
        ctx.font = "26px monospace";
        ctx.fillText(emoji, this.x + 6, this.y + 22);
    }
}