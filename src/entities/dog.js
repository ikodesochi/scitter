// entities/dog.js
// Собака — защитник мыши на уровнях Дружба и Финал
// Ходит случайно по карте, защищает мышь если сытая

import { Character } from '../core/character.js';

export class Dog extends Character {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
        
        // Сытость: 100 = сытая, 0 = голодная
        this.fullness = 100;
        
        // Показывать ли сердечко (после кормления)
        this.showHeart = false;
        
        // Для случайного блуждания
        this.stuckTimer = 0;
        this.lastX = x;
        this.lastY = y;
        this.wanderDir = { x: 0, y: 0 };
        this.wanderTimer = 0;
        
        // Режим атаки (когда кот рядом с мышью)
        this.attacking = false;
        this.attackTarget = null;
        
        // Индикатор над головой
        this.statusText = "";
        this.statusTimer = 0;
    }
    
    update(mouse, tryMove, cat) {
        // Проверка застревания
        if (Math.abs(this.x - this.lastX) < 0.5 && Math.abs(this.y - this.lastY) < 0.5) {
            this.stuckTimer++;
        } else {
            this.stuckTimer = 0;
        }
        this.lastX = this.x;
        this.lastY = this.y;
        
        // Если кот рядом с собакой и атакует мышь — собака защищает
        if (cat && mouse) {
            const catToDog = Math.hypot(cat.x - this.x, cat.y - this.y);
            const catToMouse = Math.hypot(cat.x - mouse.x, cat.y - mouse.y);
            
            if (catToDog < 100 && catToMouse < 80) {
                this.attacking = true;
                this.attackTarget = { x: cat.x, y: cat.y };
                this.showStatus("GRR!", 1);
                
                // Рывок к коту
                const dx = cat.x - this.x;
                const dy = cat.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 5) {
                    const step = Math.min(this.speed * 2, dist);
                    tryMove(this, (dx / dist) * step, (dy / dist) * step);
                }
                
                // Отталкиваем кота
                if (catToDog < 50) {
                    const pushX = (cat.x - this.x) / catToDog * 10;
                    const pushY = (cat.y - this.y) / catToDog * 10;
                    tryMove(cat, pushX, pushY);
                    this.fullness = Math.max(0, this.fullness - 0.3);
                    this.showStatus("WOOF!", 1);
                }
            } else {
                this.attacking = false;
                this.attackTarget = null;
            }
        }
        
        if (this.stuckTimer > 120) {
            this.wanderTimer = 0;
            this.stuckTimer = 0;
            this.showStatus("?", 1);
        }
        
        // Случайное блуждание (если не атакует)
        if (!this.attacking) {
            if (this.wanderTimer <= 0) {
                const angle = Math.random() * Math.PI * 2;
                this.wanderDir = {
                    x: Math.cos(angle) * this.speed * 0.5,
                    y: Math.sin(angle) * this.speed * 0.5
                };
                this.wanderTimer = 60 + Math.floor(Math.random() * 120);
                
                // Иногда стоит на месте
                if (Math.random() < 0.3) {
                    this.wanderDir = { x: 0, y: 0 };
                    this.wanderTimer = 30 + Math.floor(Math.random() * 60);
                }
            }
            
            this.wanderTimer--;
            const success = tryMove(this, this.wanderDir.x, this.wanderDir.y);
            if (!success) this.wanderTimer = 0;
        }
        
        // Медленная потеря сытости
        this.fullness = Math.max(0, this.fullness - 0.01);
        
        if (this.statusTimer > 0) this.statusTimer--;
        if (this.statusTimer === 0 && this.statusText !== "") this.statusText = "";
    }
    
    showStatus(text, seconds) {
        this.statusText = text;
        this.statusTimer = seconds * 60;
    }
    
    onFed() {
        this.showHeart = true;
        this.showStatus("<3", 2);
        setTimeout(() => { this.showHeart = false; }, 1000);
    }
    
    draw(ctx, camera, boneCount) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        
        // Тело (темнее при атаке)
        ctx.fillStyle = this.attacking ? "#555" : "#777";
        ctx.fillRect(x, y, this.w, this.h);
        
        // Уши
        ctx.fillStyle = this.attacking ? "#333" : "#555";
        ctx.fillRect(x + 2, y - 5, 7, 7);
        ctx.fillRect(x + this.w - 9, y - 5, 7, 7);
        
        // Глаза (красные при атаке)
        ctx.fillStyle = this.attacking ? "#f00" : "#000";
        ctx.fillRect(x + 5, y + 5, 5, 5);
        ctx.fillRect(x + this.w - 10, y + 5, 5, 5);
        
        // Зрачки
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 6, y + 6, 2, 2);
        ctx.fillRect(x + this.w - 9, y + 6, 2, 2);
        
        // Хвост
        ctx.fillStyle = this.attacking ? "#333" : "#555";
        ctx.fillRect(x + this.w, y - 4, 8, 2);
        
        // Статус над головой (GRR!, WOOF!, <3)
        if (this.statusText) {
            ctx.font = "10px monospace";
            ctx.fillStyle = this.attacking ? "#f00" : "#fff";
            if (Math.floor(Date.now() / 300) % 2 === 0 || this.statusTimer > 60) {
                ctx.fillText(this.statusText, x + 5, y - 16);
            }
        }
        
        // Полоска сытости (тонкая полоска над головой)
        const barWidth = this.w;
        const barHeight = 3;
        const barY = y - 8;
        
        // Фон полоски
        ctx.fillStyle = "#000";
        ctx.fillRect(x - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        // Заполнение (зелёное, жёлтое, красное)
        ctx.fillStyle = this.fullness > 50 ? "#0f0" : this.fullness > 25 ? "#ff0" : "#f00";
        ctx.fillRect(x, barY, Math.floor(barWidth * (this.fullness / 100)), barHeight);
        
        // Сердечко при кормлении
        if (this.showHeart) {
            ctx.font = "12px monospace";
            ctx.fillStyle = "#000";
            ctx.fillText("<3", x + 5, y - 20);
        }
    }
}