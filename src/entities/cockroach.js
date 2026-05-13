// entities/cockroach.js
import { Character } from '../core/character.js';

export class Cockroach extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        this.shopOpen = false;
        this.items = [
            {
                id: 'speed',
                name: 'Speed Boots',
                cost: 3,
                description: '+1 speed',
                icon: '>>',
                apply: (mouse) => { mouse.baseSpeed += 1; mouse.speed = mouse.baseSpeed; }
            },
            {
                id: 'trap_immune',
                name: 'Trap Shield',
                cost: 4,
                description: 'immune to traps',
                icon: '[]',
                apply: (mouse) => { mouse.trapImmune = true; }
            },
            {
                id: 'brave',
                name: 'Brave Heart',
                cost: 3,
                description: '-50% fear',
                icon: '!!',
                apply: (mouse) => { mouse.braveHeart = true; }
            },
            {
                id: 'vision',
                name: 'Night Eyes',
                cost: 4,
                description: '+50 vision',
                icon: 'oo',
                apply: (mouse) => { mouse.visionBoost = true; }
            },
            {
                id: 'costume',
                name: 'Cockroach Costume',
                cost: 5,
                description: 'cats ignore you',
                icon: '@@',
                apply: (mouse) => { mouse.hasCostume = true; }
            }
        ];
        
        this.dialogTimer = 0;
        this.currentMessage = "";
    }
    
    update(mouse, tryMove) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        // Таракан стоит на месте и открывает магазин при приближении
        if (dist < 50) {
            this.shopOpen = true;
            this.dialogTimer = 5;
        } else {
            this.shopOpen = false;
        }
        
        if (this.dialogTimer > 0) this.dialogTimer--;
    }
    
    getMessage() {
        if (this.shopOpen) return "Welcome! [E]";
        return "zZ";
    }
    
    draw(ctx, camera) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        
        // Тело таракана
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(x + 4, y + 6, this.w - 8, this.h - 12);
        
        // Голова
        ctx.fillStyle = "#654321";
        ctx.fillRect(x + 2, y + 2, 10, 8);
        
        // Усики
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 2);
        ctx.lineTo(x - 6, y - 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 2);
        ctx.lineTo(x + 16, y - 4);
        ctx.stroke();
        
        // Лапки
        ctx.fillStyle = "#654321";
        ctx.fillRect(x, y + 14, 6, 2);
        ctx.fillRect(x + this.w - 6, y + 14, 6, 2);
        ctx.fillRect(x, y + 20, 6, 2);
        ctx.fillRect(x + this.w - 6, y + 20, 6, 2);
        
        // Глаза
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 4, y + 4, 3, 3);
        ctx.fillRect(x + 8, y + 4, 3, 3);
        ctx.fillStyle = "#000";
        ctx.fillRect(x + 5, y + 5, 1, 1);
        ctx.fillRect(x + 9, y + 5, 1, 1);
        
        // Сообщение
        ctx.font = "8px monospace";
        ctx.fillStyle = "#ffcc00";
        ctx.fillText(this.getMessage(), x - 10, y - 8);
        
        // Индикатор магазина
        if (this.shopOpen) {
            ctx.fillStyle = "#ffcc00";
            ctx.fillRect(x + this.w/2 - 3, y + this.h + 2, 6, 6);
        }
    }
}