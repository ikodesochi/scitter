// entities/Mouse.js
import { Character } from '../core/character.js';

export class Mouse extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.cheeseCount = 0;
        this.boneCount = 0;
        this.fear = 0;
    }
    
    update(keys, tryMove, cat) {
        let dx = 0, dy = 0;
        if (keys.ArrowLeft) dx = -this.speed;
        if (keys.ArrowRight) dx = this.speed;
        if (keys.ArrowUp) dy = -this.speed;
        if (keys.ArrowDown) dy = this.speed;
        if (dx !== 0 || dy !== 0) tryMove(this, dx, dy);
        
        // Расчёт страха
        const distToCat = Math.hypot(this.x - cat.x, this.y - cat.y);
        const maxDist = 200;
        if (distToCat < maxDist) {
            this.fear = Math.min(100, Math.floor((1 - distToCat / maxDist) * 100));
        } else {
            this.fear = 0;
        }
        this.speed = Math.max(1, 4 - Math.floor(this.fear / 30));
    }
    
    getFearEmoji() {
        if (this.fear < 20) return "😊";
        if (this.fear < 50) return "😐";
        if (this.fear < 80) return "😨";
        return "😱";
    }
    
    draw(ctx, camera, cheeseCount, boneCount, totalCheeseGoal, totalBoneGoal) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        ctx.fillStyle = "#888";
        ctx.fillRect(x, y, this.w, this.h);
        
        ctx.font = "16px monospace";
        ctx.fillStyle = "#ffaa66";
        ctx.fillText(this.getFearEmoji(), x + 5, y - 10);
        
        ctx.font = "12px monospace";
        ctx.fillStyle = "#ffcc44";
        ctx.fillText(`🧀 ${cheeseCount}/${totalCheeseGoal}`, x + 5, y - 28);
        
        ctx.fillStyle = "#ddbb88";
        ctx.fillText(`🦴 ${boneCount}/${totalBoneGoal}`, x + 5, y - 40);
    }
}