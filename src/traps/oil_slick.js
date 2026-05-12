// traps/oil_slick.js
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../core/constants.js';

export let oilSlicks = [];

export function initOilSlicks(map) {
    oilSlicks = [];
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * (WORLD_WIDTH - TILE_SIZE);
        const y = Math.random() * (WORLD_HEIGHT - TILE_SIZE);
        oilSlicks.push({
            x: x,
            y: y,
            w: TILE_SIZE,
            h: TILE_SIZE,
            active: true
        });
    }
}

export function checkOilSlickCollision(mouse, cat) {
    for (let slick of oilSlicks) {
        if (!slick.active) continue;
        
        // Проверка для мыши
        if (mouse.x < slick.x + slick.w && mouse.x + mouse.w > slick.x &&
            mouse.y < slick.y + slick.h && mouse.y + mouse.h > slick.y) {
            mouse.speed = mouse.baseSpeed * 0.2;
            setTimeout(() => { mouse.speed = mouse.baseSpeed; }, 1500);
            slick.active = false;
        }
        
        // Проверка для кота
        if (cat.x < slick.x + slick.w && cat.x + cat.w > slick.x &&
            cat.y < slick.y + slick.h && cat.y + cat.h > slick.y) {
            cat.speed = cat.baseSpeed * 0.2;
            setTimeout(() => { cat.speed = cat.baseSpeed; }, 1500);
            slick.active = false;
        }
    }
}

export function drawOilSlicks(ctx, worldToScreenFn) {
    for (let slick of oilSlicks) {
        if (!slick.active) continue;
        
        const { x: screenX, y: screenY } = worldToScreenFn(slick.x, slick.y);
        ctx.fillStyle = "#444444";
        ctx.fillRect(screenX, screenY, slick.w, slick.h);
        ctx.fillStyle = "#666666";
        ctx.fillRect(screenX + 5, screenY + 5, slick.w - 10, slick.h - 10);
    }
}