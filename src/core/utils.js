// core/utils.js
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}