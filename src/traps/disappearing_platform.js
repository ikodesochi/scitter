// traps/disappearing_platform.js
import { TILE_SIZE } from '../core/constants.js';

export let platforms = [];

export function initPlatforms(map, count = 8) {
    platforms = [];
    const rows = map.length;
    const cols = map[0].length;
    
    for (let i = 0; i < count; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 50) {
            const col = Math.floor(Math.random() * (cols - 4)) + 2;
            const row = Math.floor(Math.random() * (rows - 4)) + 2;
            if (map[row][col] === 0) {
                platforms.push({
                    x: col * TILE_SIZE,
                    y: row * TILE_SIZE,
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    active: true,
                    timer: 0,
                    vanishTime: 120, // Исчезает через 2 секунды
                    respawnTime: 180 // Появляется через 3 секунды
                });
                placed = true;
            }
        }
    }
}

export function updatePlatforms() {
    for (let p of platforms) {
        if (p.active) {
            p.timer++;
            if (p.timer >= p.vanishTime) {
                p.active = false;
                p.timer = 0;
            }
        } else {
            p.timer++;
            if (p.timer >= p.respawnTime) {
                p.active = true;
                p.timer = 0;
            }
        }
    }
}

export function isOnPlatform(obj) {
    for (let p of platforms) {
        if (!p.active) continue;
        if (obj.x < p.x + p.w && obj.x + obj.w > p.x &&
            obj.y + obj.h >= p.y && obj.y + obj.h <= p.y + p.h + 2) {
            return true;
        }
    }
    return false;
}

export function drawPlatforms(ctx, camera) {
    for (let p of platforms) {
        const x = p.x - camera.x;
        const y = p.y - camera.y;
        
        if (p.active) {
            ctx.fillStyle = "#8a6a4a";
            ctx.fillRect(x, y, p.w, p.h);
            // Мигание перед исчезновением
            if (p.timer > p.vanishTime * 0.7) {
                ctx.fillStyle = "#ff6666";
                ctx.fillRect(x + 2, y + 2, p.w - 4, p.h - 4);
            }
        } else {
            // Полупрозрачный контур когда исчезла
            ctx.fillStyle = "rgba(138, 106, 74, 0.3)";
            ctx.fillRect(x, y, p.w, p.h);
        }
    }
}

export function resetPlatforms() {
    platforms = [];
}