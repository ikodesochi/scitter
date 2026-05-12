// entities/Cat.js
import { Character } from '../core/character.js';

export class Cat extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.aggression = 0;
    }
    
    update(mouse, tryMove, cheeseCollected) {
        if (cheeseCollected < 5) this.aggression = 0;
        else if (cheeseCollected < 10) this.aggression = 1;
        else this.aggression = 2;
        
        if (this.aggression === 0) this.speed = 1.8;
        else if (this.aggression === 1) this.speed = 2.5;
        else this.speed = 3.5;
        
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
            const step = Math.min(this.speed, dist);
            tryMove(this, (dx / dist) * step, (dy / dist) * step);
        }
    }
    
    getAggressionEmoji() {
        if (this.aggression === 0) return "🙂";
        if (this.aggression === 1) return "😾";
        return "😈";
    }
    
    draw(ctx, camera) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        ctx.fillStyle = "#666";
        ctx.fillRect(x, y, this.w, this.h);
        
        ctx.font = "16px monospace";
        ctx.fillStyle = "#ff8888";
        ctx.fillText(this.getAggressionEmoji(), x + 5, y - 10);
        
        ctx.font = "10px monospace";
        ctx.fillStyle = "#aaa";
        ctx.fillText(`⚡${this.speed.toFixed(1)}`, x + 5, y - 22);
    }
}