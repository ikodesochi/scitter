// entities/mouse.js
import { Character } from '../core/character.js';

export class Mouse extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.fear = 0;
        this.health = 3;
        this.invincible = false;
        this.statusText = "";
        this.statusTimer = 0;
        this.fearMeter = 0;
        this.fearMax = 100;
        this.trapImmune = false;
        this.braveHeart = false;
        this.visionBoost = false;
        this.hasCostume = false;
        this.upgrades = [];
    }
    
    update(keys, tryMove, cat) {
        let dx = 0, dy = 0;
        if (keys.ArrowLeft) dx = -this.speed;
        if (keys.ArrowRight) dx = this.speed;
        if (keys.ArrowUp) dy = -this.speed;
        if (keys.ArrowDown) dy = this.speed;
        if (dx !== 0 || dy !== 0) tryMove(this, dx, dy);
        
        if (cat) {
            const distToCat = Math.hypot(this.x - cat.x, this.y - cat.y);
            const maxDist = 200;
            
            if (this.hasCostume) {
                this.fear = 0;
                this.fearMeter = Math.max(0, this.fearMeter - 0.3);
            } else if (distToCat < 80) {
                this.fear = Math.min(100, Math.floor((1 - distToCat / maxDist) * 100));
                this.fearMeter = Math.min(this.fearMax, this.fearMeter + 0.8);
            } else if (distToCat < 150) {
                this.fear = Math.min(80, Math.floor((1 - distToCat / maxDist) * 100));
                this.fearMeter = Math.min(this.fearMax, this.fearMeter + 0.3);
            } else {
                this.fear = Math.max(0, this.fear - 0.5);
                this.fearMeter = Math.max(0, this.fearMeter - 0.2);
            }
        } else {
            this.fear = 0;
            this.fearMeter = Math.max(0, this.fearMeter - 0.3);
        }
        
        if (this.braveHeart) {
            this.fear = Math.floor(this.fear * 0.5);
            this.fearMeter = Math.max(0, this.fearMeter - 0.1);
        }
        
        if (this.fearMeter >= this.fearMax) {
            this.health = 0;
        }
        
        this.speed = Math.max(1, this.baseSpeed - Math.floor(this.fear / 30));
        
        // Таймер статуса — просто тикаем, не перезаписываем
        if (this.statusTimer > 0) {
            this.statusTimer--;
            if (this.statusTimer === 0) {
                this.statusText = "";
            }
        }
    }
    
    showStatus(text, seconds) {
        this.statusText = text;
        this.statusTimer = seconds * 60;
    }
    
    onCollectCheese() {
        this.showStatus("+🧀", 3);
    }
    
    onCollectBone() {
        this.showStatus("+🦴", 3);
    }
    
    onFeedDog() {
        this.showStatus("<3", 3);
    }
    
    onLevelStart() {
        this.statusText = "";
        this.statusTimer = 0;
        this.fearMeter = 0;
    }
    
    takeDamage() {
        if (this.invincible || this.trapImmune) return false;
        this.health--;
        this.invincible = true;
        this.showStatus("X_X", 2);
        setTimeout(() => { this.invincible = false; }, 1000);
        return this.health <= 0;
    }
    
    getVisionBonus() { return this.visionBoost ? 50 : 0; }
    
    getFearFace() {
        if (this.hasCostume) return "@@";
        if (this.fearMeter > 80) return "(.Ó﹏Ò.)";
        if (this.fear < 20) return "";
        if (this.fear < 50) return "o_o";
        if (this.fear < 80) return "O_o";
        return "@_@";
    }
    
    draw(ctx, camera, cheeseCount, boneCount, totalCheeseGoal, totalBoneGoal) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) return;
        
        ctx.fillStyle = this.hasCostume ? "#8B4513" : "#888";
        ctx.fillRect(x, y, this.w, this.h);
        
        if (this.hasCostume) {
            ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x + 4, y + 2); ctx.lineTo(x - 4, y - 6); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + this.w - 4, y + 2); ctx.lineTo(x + this.w + 4, y - 6); ctx.stroke();
        }
        
        ctx.fillStyle = "#000";
        ctx.fillRect(x + 4, y + 4, 8, 8); ctx.fillRect(x + 16, y + 4, 8, 8);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 6, y + 6, 4, 4); ctx.fillRect(x + 18, y + 6, 4, 4);
        ctx.fillStyle = "#000";
        ctx.fillRect(x - 6, y + 8, 8, 1); ctx.fillRect(x - 6, y + 12, 8, 1);
        ctx.fillRect(x + this.w - 2, y + 8, 8, 1); ctx.fillRect(x + this.w - 2, y + 12, 8, 1);
        ctx.fillStyle = this.hasCostume ? "#654321" : "#666";
        ctx.fillRect(x + this.w, y + this.h/2 - 1, 12, 2);
        
        if (this.statusText) {
            ctx.font = "12px monospace";
            ctx.fillStyle = "#fff";
            ctx.fillText(this.statusText, x + 2, y - 12);
        } else {
            const face = this.getFearFace();
            if (face) {
                ctx.font = "10px monospace";
                ctx.fillStyle = "#000";
                ctx.fillText(face, x + 4, y - 6);
            }
        }
        
        if (this.fearMeter > 0) {
            const bw = 24, bh = 3, bx = x + 2, by = y - 16;
            ctx.fillStyle = "#333";
            ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
            const fp = this.fearMeter / this.fearMax;
            ctx.fillStyle = fp < 0.5 ? "#0f0" : fp < 0.8 ? "#ff0" : "#f00";
            ctx.fillRect(bx, by, Math.floor(bw * fp), bh);
            ctx.font = "5px monospace"; ctx.fillStyle = "#fff";
            ctx.fillText("FEAR", bx, by - 2);
        }
        
        let iy = y - 28;
        ctx.font = "7px monospace";
        if (this.trapImmune) { ctx.fillStyle = "#0ff"; ctx.fillText("[]", x + 2, iy); iy -= 8; }
        if (this.braveHeart) { ctx.fillStyle = "#f0f"; ctx.fillText("!!", x + 2, iy); iy -= 8; }
        if (this.visionBoost) { ctx.fillStyle = "#ff0"; ctx.fillText("oo", x + 2, iy); iy -= 8; }
        if (this.hasCostume) { ctx.fillStyle = "#fa0"; ctx.fillText("@@", x + 2, iy); }
        
        if (this.health < 3) {
            ctx.font = "8px monospace"; ctx.fillStyle = "#f00";
            ctx.fillText("[ " + "|".repeat(this.health) + " ]", x + 2, y - 38);
        }
    }
    
    resetUpgrades() {
        this.trapImmune = false; this.braveHeart = false;
        this.visionBoost = false; this.hasCostume = false;
        this.upgrades = []; this.baseSpeed = 4; this.speed = 4;
        this.fearMeter = 0;
    }
}