// core/utils.js

/**
 * Случайное целое число от min до max включительно
 * @param {number} min - минимум
 * @param {number} max - максимум
 * @returns {number}
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Случайный элемент из массива
 * @param {Array} array - исходный массив
 * @returns {*} случайный элемент
 */
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Ограничение значения диапазоном
 * @param {number} value - исходное значение
 * @param {number} min - минимум
 * @param {number} max - максимум
 * @returns {number}
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * Перемешивает массив (алгоритм Фишера-Йетса)
 * @param {Array} array - исходный массив
 * @returns {Array} - новый перемешанный массив
 */
export function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}