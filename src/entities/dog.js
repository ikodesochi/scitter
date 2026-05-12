// entities/Dog.js
import { Character } from '../core/character.js';

export class Dog extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.fullness = 100;
        this.boneCount = 0;
    }
    
    update(mouse, tryMove) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 100) {
            const step = Math.min(this.speed, dist);
            tryMove(this, (dx / dist) * step, (dy / dist) * step);
        }
        this.fullness = Math.max(0, this.fullness - 0.02);
    }
    
    draw(ctx, camera, boneCount) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        ctx.fillStyle = "#555";
        ctx.fillRect(x, y, this.w, this.h);
        ctx.font = "14px monospace";
        ctx.fillStyle = "#ccaa88";
        ctx.fillText(`🦴 ${boneCount}`, x + 5, y - 5);
    }
}