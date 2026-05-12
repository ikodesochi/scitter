// systems/holeManager.js
import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT } from '../core/constants.js';
import { getWorldMap, addCheese, getCheeseCollected, getCheeseGoal, setInSewer, nextLevel, isInSewer } from './levelManager.js';
import { getMouse } from './levelManager.js';

let holes = [];

export function generateHoles() {
    holes = [];
    const worldMap = getWorldMap();
    const numHoles = 5;
    
    for (let i = 0; i < numHoles; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const x = Math.random() * (WORLD_WIDTH - TILE_SIZE);
            const y = Math.random() * (WORLD_HEIGHT - TILE_SIZE);
            const col = Math.floor(x / TILE_SIZE);
            const row = Math.floor(y / TILE_SIZE);
            if (worldMap[row] && worldMap[row][col] === 0) {
                holes.push({ x, y, w: TILE_SIZE, h: TILE_SIZE, active: false });
                placed = true;
            }
            attempts++;
        }
    }
}

export function updateHoles() {
    const cheeseCollected = getCheeseCollected();
    const cheeseGoal = getCheeseGoal();
    
    // Активируем лунки, если собрано достаточно сыра
    if (cheeseCollected >= cheeseGoal) {
        for (let hole of holes) {
            hole.active = true;
        }
    }
    
    // Проверяем, не наступила ли мышь на активную лунку
    const mouse = getMouse();
    for (let hole of holes) {
        if (hole.active && 
            mouse.x < hole.x + hole.w && mouse.x + mouse.w > hole.x &&
            mouse.y < hole.y + hole.h && mouse.y + mouse.h > hole.y) {
            setInSewer(true);
            nextLevel();
            return;
        }
    }
}

export function drawHoles(ctx, camera) {
    for (let hole of holes) {
        if (hole.active) {
            const x = hole.x - camera.x;
            const y = hole.y - camera.y;
            ctx.fillStyle = "#444";
            ctx.fillRect(x, y, hole.w, hole.h);
            ctx.fillStyle = "#222";
            ctx.fillRect(x + 5, y + 5, hole.w - 10, hole.h - 10);
        }
    }
}

export function resetHoles() {
    holes = [];
}