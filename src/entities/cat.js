// entities/cat.js
// Кот — враг мыши. Патрулирует, преследует, может быть невидимым

import { Character } from '../core/character.js';

export class Cat extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.aggression = 0;
        this.patrolDir = { x: 0, y: 0 };
        this.patrolTimer = 0;
        this.patrolWait = 0;
        this.homeX = x;
        this.homeY = y;
        this.patrolRadius = 150;
        this.chasing = false;
        this.lastSeenMouse = null;
        this.lostSightTimer = 0;
        this.visionRange = 150;
        this.stuckTimer = 0;
        this.lastX = x;
        this.lastY = y;
        this.statusText = "";
        this.statusTimer = 0;
        this.frozen = false;
        this.frozenTimer = 0;
    }
    
    update(mouse, tryMoveFn, levelInfo) {
        if (this.frozen) {
            this.frozenTimer--;
            if (this.frozenTimer <= 0) this.frozen = false;
            this.showStatus("x_x", 1);
            if (this.statusTimer > 0) this.statusTimer--;
            if (this.statusTimer === 0) this.statusText = "";
            return;
        }
        
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (Math.abs(this.x - this.lastX) < 0.1 && Math.abs(this.y - this.lastY) < 0.1) {
            this.stuckTimer++;
        } else {
            this.stuckTimer = 0;
        }
        this.lastX = this.x;
        this.lastY = this.y;
        
        if (this.stuckTimer > 120) {
            this.patrolTimer = 0;
            this.stuckTimer = 0;
            if (this.chasing) {
                this.chasing = false;
                this.lostSightTimer = 90;
                this.showStatus("?", 1);
            }
        }
        
        const canSeeMouse = this.visionRange > 1000 || (dist < this.visionRange);
        
        if (canSeeMouse && dist < this.visionRange) {
            this.chasing = true;
            this.lastSeenMouse = { x: mouse.x, y: mouse.y };
            this.lostSightTimer = 0;
            this.speed = this.baseSpeed * 1.5;
            this.showStatus("!", 1);
            
            if (dist > 5) {
                const step = Math.min(this.speed, dist);
                tryMoveFn(this, (dx / dist) * step, (dy / dist) * step);
            }
        } else if (this.chasing) {
            this.lostSightTimer++;
            this.showStatus("?", 1);
            
            if (this.lastSeenMouse && this.lostSightTimer < 90) {
                const ldx = this.lastSeenMouse.x - this.x;
                const ldy = this.lastSeenMouse.y - this.y;
                const ldist = Math.hypot(ldx, ldy);
                
                if (ldist > 5) {
                    const step = Math.min(this.speed * 0.7, ldist);
                    tryMoveFn(this, (ldx / ldist) * step, (ldy / ldist) * step);
                } else {
                    this.patrolWait = 60;
                    this.chasing = false;
                    this.showStatus("zZ", 2);
                }
            } else {
                this.chasing = false;
                this.lastSeenMouse = null;
                this.speed = this.baseSpeed;
                this.showStatus("zZ", 2);
            }
        } else {
            this.patrol(tryMoveFn);
            this.speed = this.baseSpeed;
        }
        
        if (this.statusTimer > 0) this.statusTimer--;
        if (this.statusTimer === 0) this.statusText = "";
    }
    
    showStatus(text, seconds) {
        this.statusText = text;
        this.statusTimer = seconds * 60;
    }
    
    patrol(tryMoveFn) {
        if (this.patrolWait > 0) { this.patrolWait--; return; }
        
        if (this.patrolTimer <= 0) {
            const toHomeX = this.homeX - this.x;
            const toHomeY = this.homeY - this.y;
            const distToHome = Math.hypot(toHomeX, toHomeY);
            
            if (distToHome > this.patrolRadius) {
                const step = Math.min(this.speed, distToHome);
                this.patrolDir = { x: (toHomeX / distToHome) * step, y: (toHomeY / distToHome) * step };
            } else {
                const angle = Math.random() * Math.PI * 2;
                this.patrolDir = { x: Math.cos(angle) * this.speed, y: Math.sin(angle) * this.speed };
                this.patrolTimer = 60 + Math.floor(Math.random() * 120);
                this.patrolWait = Math.floor(Math.random() * 90);
            }
        }
        
        this.patrolTimer--;
        tryMoveFn(this, this.patrolDir.x, this.patrolDir.y);
    }
    
    draw(ctx, camera, levelInfo) {
        // Невидимый кот — только красные глаза
        if (levelInfo?.catInvisible) {
            const x = this.x - camera.x;
            const y = this.y - camera.y;
            
            if (Math.sin(Date.now() / 300) > 0) {
                ctx.fillStyle = "#f00";
                ctx.fillRect(x + 4, y + 4, 8, 8);
                ctx.fillRect(x + this.w - 12, y + 4, 8, 8);
                ctx.fillStyle = "#000";
                ctx.fillRect(x + 7, y + 7, 3, 3);
                ctx.fillRect(x + this.w - 9, y + 7, 3, 3);
            }
            return;
        }
        
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        
        ctx.fillStyle = this.frozen ? "#666" : this.chasing ? "#444" : "#555";
        ctx.fillRect(x, y, this.w, this.h);
        
        ctx.fillStyle = this.frozen ? "#555" : this.chasing ? "#333" : "#444";
        ctx.fillRect(x + 2, y - 6, 6, 8);
        ctx.fillRect(x + this.w - 8, y - 6, 6, 8);
        
        ctx.fillStyle = this.frozen ? "#fff" : this.chasing ? "#f00" : "#000";
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillRect(x + this.w - 12, y + 4, 8, 8);
        
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 6, y + 6, 3, 3);
        ctx.fillRect(x + this.w - 10, y + 6, 3, 3);
        
        ctx.fillStyle = this.frozen ? "#555" : this.chasing ? "#333" : "#444";
        ctx.fillRect(x - 10, y + this.h/2, 12, 2);
        
        if (this.statusText) {
            ctx.font = "10px monospace";
            ctx.fillStyle = "#fff";
            if (Math.floor(Date.now() / 300) % 2 === 0 || this.statusTimer > 60) {
                ctx.fillText(this.statusText, x + 8, y - 10);
            }
        }
    }
}