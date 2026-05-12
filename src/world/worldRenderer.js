// world/worldRenderer.js
import { TILE_SIZE } from '../core/constants.js';
import { TILE_WALL, TILE_TREE, TILE_WATER, TILE_HOUSE, TILE_CRATE } from './worldGenerator.js';

export function drawWorld(ctx, camera, worldMap) {
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const endCol = Math.min(worldMap[0].length, Math.ceil((camera.x + ctx.canvas.width) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endRow = Math.min(worldMap.length, Math.ceil((camera.y + ctx.canvas.height) / TILE_SIZE) + 1);
    
    for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
            const x = col * TILE_SIZE - camera.x;
            const y = row * TILE_SIZE - camera.y;
            const tile = worldMap[row][col];
            
            if (tile === TILE_WALL) {
                ctx.fillStyle = "#333";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === TILE_TREE) {
                ctx.fillStyle = "#2a5a2a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === TILE_WATER) {
                ctx.fillStyle = "#2a6a8a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === TILE_HOUSE) {
                ctx.fillStyle = "#8a6a4a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === TILE_CRATE) {
                ctx.fillStyle = "#8a5a3a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}