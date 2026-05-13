// world/worldRenderer.js
import { TILE_SIZE } from '../core/constants.js';

export function drawWorld(ctx, camera, worldMap, fearMouse = null) {
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const endCol = Math.min(worldMap[0].length, Math.ceil((camera.x + ctx.canvas.width) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endRow = Math.min(worldMap.length, Math.ceil((camera.y + ctx.canvas.height) / TILE_SIZE) + 1);
    
    // Красная аура страха вокруг мыши
    if (fearMouse) {
        const mx = Math.floor(fearMouse.x / TILE_SIZE);
        const my = Math.floor(fearMouse.y / TILE_SIZE);
        
        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const dist = Math.sqrt((row - my) ** 2 + (col - mx) ** 2);
                if (dist < 5 && worldMap[row][col] !== 0 && Math.sin(Date.now() / 500 + dist) > 0.3) {
                    const x = col * TILE_SIZE - camera.x;
                    const y = row * TILE_SIZE - camera.y;
                    ctx.fillStyle = "rgba(255, 0, 0, 0.35)";
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
    
    for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
            const x = col * TILE_SIZE - camera.x;
            const y = row * TILE_SIZE - camera.y;
            const tile = worldMap[row][col];
            
            if (tile === 1) {
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = "#0d0d0d";
                ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                ctx.fillStyle = "#222";
                ctx.fillRect(x + 2, y + 8, TILE_SIZE - 4, 1);
                ctx.fillRect(x + 2, y + 18, TILE_SIZE - 4, 1);
                ctx.fillRect(x + 2, y + 28, TILE_SIZE - 4, 1);
                ctx.fillStyle = "#2a2a2a";
                ctx.fillRect(x + 4, y + 1, TILE_SIZE - 8, 1);
            } else if (tile === 2) {
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = "#0d0d0d";
                ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            } else if (tile === 3) {
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = "#222";
                ctx.fillRect(x + 2, y + 10, TILE_SIZE - 4, 2);
                ctx.fillRect(x + 2, y + 20, TILE_SIZE - 4, 2);
            } else if (tile === 4) {
                ctx.fillStyle = "#151515";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = "#0a0a0a";
                ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
            } else if (tile === 5) {
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = "#111";
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            } else {
                ctx.fillStyle = "#2a2a2a";
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                if ((row + col) % 3 === 0) {
                    ctx.fillStyle = "#282828";
                    ctx.fillRect(x + 2, y + 2, 2, 2);
                }
            }
        }
    }
}