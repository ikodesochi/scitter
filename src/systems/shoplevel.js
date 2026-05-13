// systems/shopLevel.js
// Статика и генерация уровня вентиляции с тараканом

import { TILE_SIZE } from '../core/constants.js';
import { Cockroach } from '../entities/cockroach.js';

export function buildShopMap(rows, cols) {
    let map = Array(rows).fill().map(() => Array(cols).fill(1));
    
    const midCol = Math.floor(cols / 2);
    const midRow = Math.floor(rows / 2);
    const corridorLeft = midCol - 2;
    const corridorRight = midCol + 2;
    
    // Главный коридор
    for (let i = 1; i < rows - 1; i++) {
        for (let j = corridorLeft; j <= corridorRight; j++) {
            map[i][j] = 0;
        }
    }
    
    // Вход снизу
    for (let j = midCol - 1; j <= midCol + 1; j++) {
        map[rows - 1][j] = 0;
        map[rows - 2][j] = 0;
    }
    
    // Выход сверху
    for (let j = midCol - 1; j <= midCol + 1; j++) {
        map[0][j] = 0;
        map[1][j] = 0;
    }
    
    // Ответвление к таракану
    const branchRow = midRow;
    const branchStart = corridorLeft - 6;
    
    for (let j = branchStart; j < corridorLeft; j++) {
        map[branchRow][j] = 0;
        map[branchRow + 1][j] = 0;
    }
    map[branchRow][corridorLeft] = 0;
    map[branchRow + 1][corridorLeft] = 0;
    
    // Комнатка таракана
    for (let i = branchRow - 1; i <= branchRow + 2; i++) {
        for (let j = branchStart - 2; j <= branchStart + 2; j++) {
            if (i >= branchRow && i <= branchRow + 1 && j >= branchStart - 1 && j <= branchStart + 1) {
                map[i][j] = 0;
            }
        }
    }
    map[branchRow][branchStart + 2] = 0;
    map[branchRow + 1][branchStart + 2] = 0;
    
    // Декоративные решётки
    for (let i = 5; i < rows - 5; i += 6) {
        if (Math.abs(i - branchRow) > 2) {
            map[i][corridorLeft] = 1;
            map[i][corridorRight] = 1;
        }
    }
    
    return map;
}

export function createShopEntities(COLS, ROWS) {
    const midCol = Math.floor(COLS / 2);
    const midRow = Math.floor(ROWS / 2);
    const branchStart = midCol - 2 - 6;
    
    const mousePos = {
        x: midCol * TILE_SIZE + TILE_SIZE/2 - 14,
        y: (ROWS - 3) * TILE_SIZE
    };
    
    const cockroachPos = {
        x: (branchStart - 1) * TILE_SIZE + TILE_SIZE/2 - 16,
        y: midRow * TILE_SIZE + TILE_SIZE/2 - 16
    };
    
    const holePos = {
        x: midCol * TILE_SIZE - TILE_SIZE/2 + TILE_SIZE/2,
        y: 2 * TILE_SIZE,
        w: TILE_SIZE,
        h: TILE_SIZE
    };
    
    return { mousePos, cockroachPos, holePos };
}