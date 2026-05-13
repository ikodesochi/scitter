// systems/input.js
// Обработка клавиатуры: WASD для игры, стрелки для админ-панели

import { TILE_SIZE } from '../core/constants.js';
import { getWorldMap, getCat } from './levelManager.js';

// Клавиши для движения мыши (только WASD, не стрелки)
export const keys = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
};

export function initInput() {
    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });
}

function isSolid(tile) {
    return tile !== 0;
}

export function tryMove(obj, dx, dy) {
    const worldMap = getWorldMap();
    if (!worldMap) return false;
    
    const tileSize = TILE_SIZE;
    const cols = worldMap[0].length;
    const rows = worldMap.length;
    let moved = false;
    
    if (dx !== 0) {
        const newX = obj.x + dx;
        const left = Math.floor(Math.min(newX, obj.x) / tileSize);
        const right = Math.floor((Math.max(newX, obj.x) + obj.w - 1) / tileSize);
        const top = Math.floor((obj.y + 1) / tileSize);
        const bottom = Math.floor((obj.y + obj.h - 2) / tileSize);
        let blocked = false;
        
        if (left < 0 || right >= cols || top < 0 || bottom >= rows) {
            blocked = true;
        } else {
            for (let row = top; row <= bottom && !blocked; row++) {
                if (dx > 0) {
                    if (isSolid(worldMap[row][right])) {
                        blocked = true;
                        obj.x = right * tileSize - obj.w;
                    }
                } else {
                    if (isSolid(worldMap[row][left])) {
                        blocked = true;
                        obj.x = (left + 1) * tileSize;
                    }
                }
            }
        }
        if (!blocked) { obj.x = newX; moved = true; }
    }
    
    if (dy !== 0) {
        const newY = obj.y + dy;
        const left = Math.floor((obj.x + 1) / tileSize);
        const right = Math.floor((obj.x + obj.w - 2) / tileSize);
        const top = Math.floor(Math.min(newY, obj.y) / tileSize);
        const bottom = Math.floor((Math.max(newY, obj.y) + obj.h - 1) / tileSize);
        let blocked = false;
        
        if (left < 0 || right >= cols || top < 0 || bottom >= rows) {
            blocked = true;
        } else {
            for (let col = left; col <= right && !blocked; col++) {
                if (dy > 0) {
                    if (isSolid(worldMap[bottom][col])) {
                        blocked = true;
                        obj.y = bottom * tileSize - obj.h;
                    }
                } else {
                    if (isSolid(worldMap[top][col])) {
                        blocked = true;
                        obj.y = (top + 1) * tileSize;
                    }
                }
            }
        }
        if (!blocked) { obj.y = newY; moved = true; }
    }
    
    return moved;
}

export function processInput(mouse) {
    let dx = 0, dy = 0;
    
    if (keys.KeyW) dy = -mouse.speed;
    if (keys.KeyS) dy = mouse.speed;
    if (keys.KeyA) dx = -mouse.speed;
    if (keys.KeyD) dx = mouse.speed;
    
    if (dx !== 0 || dy !== 0) {
        tryMove(mouse, dx, dy);
    }
    
    // Вызываем update мыши для тикания таймеров (статусы, страх)
    const cat = getCat();
    mouse.update(keys, tryMove, cat);
}

processInput.tryMove = tryMove;