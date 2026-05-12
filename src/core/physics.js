// core/physics.js — модуль физики (не меняется от локации к локации)

/**
 * Проверяет, есть ли стена в заданной области
 * @param {number} x - координата X левого верхнего угла
 * @param {number} y - координата Y левого верхнего угла
 * @param {number} w - ширина области
 * @param {number} h - высота области
 * @param {Array<Array<number>>} map - карта уровня (0 - проход, 1 - стена)
 * @param {number} tileSize - размер клетки в пикселях
 * @returns {boolean} true - стена есть, false - свободно
 */
export function isSolid(x, y, w, h, map, tileSize) {
    const left = Math.max(0, Math.floor(x / tileSize));
    const right = Math.min(map[0].length - 1, Math.floor((x + w - 1) / tileSize));
    const top = Math.max(0, Math.floor(y / tileSize));
    const bottom = Math.min(map.length - 1, Math.floor((y + h - 1) / tileSize));
    
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (map[i][j] === 1) return true;
        }
    }
    return false;
}

/**
 * Безопасное перемещение объекта с проверкой стен
 * @param {Object} obj - объект с полями x, y, w, h
 * @param {number} dx - смещение по оси X
 * @param {number} dy - смещение по оси Y
 * @param {Array<Array<number>>} map - карта уровня
 * @param {number} tileSize - размер клетки
 * @param {Array<Array<number>>} mapData - карта уровня (для передачи в isSolid)
 */
export function tryMove(obj, dx, dy, map, tileSize, mapData) {
    const newX = obj.x + dx;
    const newY = obj.y + dy;
    
    // Движение по горизонтали
    if (!isSolid(newX, obj.y, obj.w, obj.h, mapData, tileSize)) {
        obj.x = newX;
    }
    // Движение по вертикали
    if (!isSolid(obj.x, newY, obj.w, obj.h, mapData, tileSize)) {
        obj.y = newY;
    }
}

/**
 * Расстояние между двумя объектами
 * @param {Object} a - первый объект (x, y)
 * @param {Object} b - второй объект (x, y)
 * @returns {number} расстояние в пикселях
 */
export function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

/**
 * Проверка столкновения двух прямоугольников
 * @param {Object} a - объект с полями x, y, w, h
 * @param {Object} b - объект с полями x, y, w, h
 * @returns {boolean} true - столкнулись, false - нет
 */
export function isColliding(a, b) {
    return (a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y);
}

/**
 * Нормализация вектора (получение направления)
 * @param {number} dx - разница по X
 * @param {number} dy - разница по Y
 * @returns {{dx: number, dy: number}} нормализованный вектор (длина = 1)
 */
export function normalize(dx, dy) {
    const len = Math.hypot(dx, dy);
    return len === 0 ? { dx: 0, dy: 0 } : { dx: dx / len, dy: dy / len };
}

/**
 * Ограничение значения диапазоном (clamp)
 * @param {number} value - исходное значение
 * @param {number} min - минимум
 * @param {number} max - максимум
 * @returns {number} ограниченное значение
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * Линейная интерполяция (плавное движение)
 * @param {number} a - начальное значение
 * @param {number} b - конечное значение
 * @param {number} t - коэффициент (0–1)
 * @returns {number} промежуточное значение
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}