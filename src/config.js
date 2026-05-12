// config.js — глобальные настройки игры
export const CONFIG = {
    // --- РАЗМЕРЫ ЭКРАНА ---
    W: 800,
    H: 600,
    TILE_SIZE: 40,
    
    // --- СКОРОСТИ ПЕРСОНАЖЕЙ (базовые, могут меняться локациями) ---
    MOUSE_BASE_SPEED: 4,
    CAT_BASE_SPEED: 2.2,
    DOG_BASE_SPEED: 1.5,
    
    // --- ПАРАМЕТРЫ ИГРЫ ---
    TOTAL_LEVELS: 5,
    GRAVITY: 0.6,
    JUMP_POWER: -9,
    
    // --- ПАРАМЕТРЫ КОТА ---
    CAT_MAX_SPEED: 5,
    CAT_VIEW_RADIUS: 200,
    CAT_VIEW_ANGLE: 90,
    
    // --- ПАРАМЕТРЫ СОБАКИ ---
    DOG_FULLNESS_START: 100,
    DOG_FULLNESS_DECAY: 0.05,      // сколько теряет за кадр
    DOG_FEED_AMOUNT: 20,           // сколько восстанавливает кость
    DOG_PROTECTION_RADIUS: 80,
    
    // --- ПАРАМЕТРЫ СТРАХА МЫШИ ---
    FEAR_MAX_DISTANCE: 200,
    FEAR_SPEED_REDUCTION: 150,     // делитель, на который падает скорость
    
    // --- ПАРАМЕТРЫ УРОВНЕЙ ---
    CHEESE_GOAL: 3,                 // сколько сыра нужно для перехода на след уровень
    BONES_GOAL: 3,                  // сколько костей нужно для финала
    
    // --- ПАРАМЕТРЫ ПРИМАНКИ ---
    LURE_LIFE_TIME: 120,            // кадров (2 секунды при 60 fps)
    LURE_SPEED: 4,
    LURE_SIZE: 16,
    
    // --- FTP (Frames Per Second) ---
    TARGET_FPS: 60
};