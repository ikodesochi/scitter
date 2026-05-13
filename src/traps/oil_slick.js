// traps/oil_slick.js
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../core/constants.js';

export let oilSlicks = [];

export function initOilSlicks(map) {
    oilSlicks = [];
    let count = 30;
    
    // Используем переданную карту для проверки пустых мест
    if (map) {
        const rows = map.length;
        const cols = map[0].length;
        for (let i = 0; i < count; i++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 50) {
                const col = Math.floor(Math.random() * (cols - 4)) + 2;
                const row = Math.floor(Math.random() * (rows - 4)) + 2;
                if (map[row] && map[row][col] === 0) {
                    oilSlicks.push({
                        x: col * TILE_SIZE,
                        y: row * TILE_SIZE,
                        w: TILE_SIZE,
                        h: TILE_SIZE,
                        active: true
                    });
                    placed = true;
                }
                attempts++;
            }
        }
    } else {
        // Запасной вариант, если карта не передана
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (WORLD_WIDTH - TILE_SIZE);
            const y = Math.random() * (WORLD_HEIGHT - TILE_SIZE);
            oilSlicks.push({
                x: x, y: y,
                w: TILE_SIZE, h: TILE_SIZE,
                active: true
            });
        }
    }
}

export function checkOilSlickCollision(mouse, cat) {
    for (let slick of oilSlicks) {
        if (!slick.active) continue;
        
        // Проверка для мыши
        if (mouse.x < slick.x + slick.w && mouse.x + mouse.w > slick.x &&
            mouse.y < slick.y + slick.h && mouse.y + mouse.h > slick.y) {
            mouse.speed = mouse.baseSpeed * 0.3;
            setTimeout(() => { mouse.speed = mouse.baseSpeed; }, 1500);
            slick.active = false;
        }
        
        // Проверка для кота
        if (cat && cat.x < slick.x + slick.w && cat.x + cat.w > slick.x &&
            cat.y < slick.y + slick.h && cat.y + cat.h > slick.y) {
            cat.speed = cat.baseSpeed * 0.3;
            setTimeout(() => { cat.speed = cat.baseSpeed; }, 1500);
            slick.active = false;
        }
    }
}

export function drawOilSlicks(ctx, worldToScreenFn) {
    for (let slick of oilSlicks) {
        if (!slick.active) continue;
        
        const { x: screenX, y: screenY } = worldToScreenFn(slick.x, slick.y);
        ctx.fillStyle = "#333333";
        ctx.fillRect(screenX, screenY, slick.w, slick.h);
        ctx.fillStyle = "#555555";
        ctx.beginPath();
        ctx.arc(screenX + slick.w/2, screenY + slick.h/2, slick.w/3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ✅ ВОТ ЭТА ФУНКЦИЯ БЫЛА УПУЩЕНА:
export function resetOilSlicks() {
    oilSlicks = [];
}