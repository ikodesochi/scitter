// scripts/obstacles.js
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../core/constants.js';
import { generateWorld, TILE_WATER, TILE_TREE, TILE_HOUSE, TILE_WALL } from '../world/worldGenerator.js';

export let obstacles = [];

export function initObstacles(map) {
    obstacles = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            const tile = map[y][x];
            const worldX = x * TILE_SIZE;
            const worldY = y * TILE_SIZE;
            
            if (tile === TILE_WATER) {
                obstacles.push({
                    type: "water",
                    x: worldX,
                    y: worldY,
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    effect: "slow"
                });
            } else if (tile === TILE_TREE) {
                obstacles.push({
                    type: "tree",
                    x: worldX,
                    y: worldY,
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    effect: "block"
                });
            } else if (tile === TILE_HOUSE) {
                obstacles.push({
                    type: "house",
                    x: worldX,
                    y: worldY,
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    effect: "block"
                });
            }
        }
    }
}

export function checkObstacleCollision(mouse, cat, dog) {
    for (let obs of obstacles) {
        // Проверка столкновения с мышью
        if (mouse.x < obs.x + obs.w && mouse.x + mouse.w > obs.x &&
            mouse.y < obs.y + obs.h && mouse.y + mouse.h > obs.y) {
            
            if (obs.effect === "slow") {
                mouse.speed = Math.max(1, mouse.baseSpeed * 0.3);
                setTimeout(() => { mouse.speed = mouse.baseSpeed; }, 1000);
            } else if (obs.effect === "block") {
                // Блокируем движение (уже обработано физикой)
            }
        }
        
        // Кот тоже может замедляться в воде
        if (cat.x < obs.x + obs.w && cat.x + cat.w > obs.x &&
            cat.y < obs.y + obs.h && cat.y + cat.h > obs.y) {
            if (obs.type === "water") {
                cat.speed = Math.max(1, cat.baseSpeed * 0.5);
                setTimeout(() => { cat.speed = cat.baseSpeed; }, 1000);
            }
        }
    }
}

export function drawObstacles(ctx, worldToScreenFn) {
    for (let obs of obstacles) {
        const { x: screenX, y: screenY } = worldToScreenFn(obs.x, obs.y);
        
        if (obs.type === "water") {
            ctx.fillStyle = "#2a6a8a";
            ctx.fillRect(screenX, screenY, obs.w, obs.h);
            ctx.fillStyle = "#4a8aaa";
            ctx.fillRect(screenX + 5, screenY + 5, obs.w - 10, obs.h - 10);
        } else if (obs.type === "tree") {
            ctx.fillStyle = "#2a5a2a";
            ctx.fillRect(screenX, screenY, obs.w, obs.h);
            ctx.fillStyle = "#3a7a3a";
            ctx.fillRect(screenX + 8, screenY + 8, obs.w - 16, obs.h - 16);
        } else if (obs.type === "house") {
            ctx.fillStyle = "#8a6a4a";
            ctx.fillRect(screenX, screenY, obs.w, obs.h);
            ctx.fillStyle = "#aa8a6a";
            ctx.fillRect(screenX + 10, screenY + 10, obs.w - 20, 15);
        }
    }
}