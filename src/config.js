// config.js — глобальные настройки игры
export const CONFIG = {
    // ... всё как у тебя ...
};

// Для обратной совместимости с существующим кодом
export const W = CONFIG.W;
export const H = CONFIG.H;
export const TILE_SIZE = CONFIG.TILE_SIZE;
export const WORLD_WIDTH = CONFIG.W * 5;   // Мир в 5 раз шире экрана
export const WORLD_HEIGHT = CONFIG.H * 5;   // Мир в 5 раз выше экрана
export const MOUSE_SPEED = CONFIG.MOUSE_BASE_SPEED;
export const CAT_SPEED = CONFIG.CAT_BASE_SPEED;
export const DOG_SPEED = CONFIG.DOG_BASE_SPEED;
export const COLS = Math.floor(WORLD_WIDTH / TILE_SIZE);
export const ROWS = Math.floor(WORLD_HEIGHT / TILE_SIZE);