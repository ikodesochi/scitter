// world/worldGenerator.js
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../core/constants.js';
import { randomInt } from '../core/utils.js';

export const TILE_EMPTY = 0;
export const TILE_WALL = 1;
export const TILE_TREE = 2;
export const TILE_WATER = 3;
export const TILE_HOUSE = 4;
export const TILE_CRATE = 5;

const COLS = Math.floor(WORLD_WIDTH / TILE_SIZE);
const ROWS = Math.floor(WORLD_HEIGHT / TILE_SIZE);

export function generateWorld() {
    let map = Array(ROWS).fill().map(() => Array(COLS).fill(TILE_EMPTY));
    
    for (let i = 0; i < ROWS; i++) {
        map[i][0] = TILE_WALL;
        map[i][COLS-1] = TILE_WALL;
    }
    for (let j = 0; j < COLS; j++) {
        map[0][j] = TILE_WALL;
        map[ROWS-1][j] = TILE_WALL;
    }
    
    for (let i = 0; i < 200; i++) {
        let x = randomInt(2, COLS-3);
        let y = randomInt(2, ROWS-3);
        if (map[y][x] === TILE_EMPTY) map[y][x] = TILE_TREE;
    }
    
    for (let i = 0; i < 100; i++) {
        let x = randomInt(2, COLS-3);
        let y = randomInt(2, ROWS-3);
        if (map[y][x] === TILE_EMPTY) map[y][x] = TILE_CRATE;
    }
    
    return map;
}