// core/utils.js — вспомогательные функции

/**
 * Случайное целое число от min до max (включительно)
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Случайный элемент из массива
 */
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Перемешивание массива (Fisher-Yates)
 */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Преобразование пикселей в номер клетки
 */
export function pxToTile(px, tileSize) {
    return Math.floor(px / tileSize);
}

/**
 * Преобразование номера клетки в пиксели
 */
export function tileToPx(tile, tileSize) {
    return tile * tileSize;
}

/**
 * Форматирование времени (секунды → MM:SS)
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Глубокое копирование простого объекта (не для классов!)
 */
export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}