// traps/spikes.js
import { TILE_SIZE } from '../core/constants.js';

export let spikes = [];

export function initSpikes(map, count = 10) {
    spikes = [];
    const rows = map.length;
    const cols = map[0].length;
    
    for (let i = 0; i < count; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 50) {
            const col = Math.floor(Math.random() * (cols - 4)) + 2;
            const row = Math.floor(Math.random() * (rows - 4)) + 2;
            if (map[row][col] === 0) {
                spikes.push({
                    x: col * TILE_SIZE,
                    y: row * TILE_SIZE,
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    active: true,
                    damage: 1
                });
                placed = true;
            }
        }
    }
}

export function checkSpikeCollision(obj) {
    for (let s of spikes) {
        if (!s.active) continue;
        if (obj.x < s.x + s.w && obj.x + obj.w > s.x &&
            obj.y < s.y + s.h && obj.y + obj.h > s.y) {
            return true;
        }
    }
    return false;
}

export function drawSpikes(ctx, camera) {
    for (let s of spikes) {
        if (!s.active) continue;
        const x = s.x - camera.x;
        const y = s.y - camera.y;
        
        // Основание
        ctx.fillStyle = "#666";
        ctx.fillRect(x, y, s.w, s.h);
        
        // Шипы (треугольники)
        ctx.fillStyle = "#ff4444";
        const spikeCount = 3;
        const spikeWidth = s.w / spikeCount;
        for (let i = 0; i < spikeCount; i++) {
            const sx = x + i * spikeWidth;
            ctx.beginPath();
            ctx.moveTo(sx, y + s.h);
            ctx.lineTo(sx + spikeWidth/2, y);
            ctx.lineTo(sx + spikeWidth, y + s.h);
            ctx.fill();
        }
    }
}

export function resetSpikes() {
    spikes = [];
}