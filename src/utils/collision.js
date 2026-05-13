// utils/collision.js
// Модуль проверки столкновений (стены, объекты, персонажи)

// ---------- СТОЛКНОВЕНИЯ СО СТЕНАМИ ----------

/**
 * Проверяет, пересекается ли прямоугольник с какой-либо стеной на карте
 * @param {number} x - координата X левого верхнего угла
 * @param {number} y - координата Y левого верхнего угла
 * @param {number} w - ширина прямоугольника
 * @param {number} h - высота прямоугольника
 * @param {Array<Array<number>>} map - карта уровня (0 - проход, 1 - стена)
 * @param {number} tileSize - размер одной клетки в пикселях
 * @returns {boolean} true - есть столкновение, false - свободно
 */
function isSolid(x, y, w, h, map, tileSize) {
    // Определяем, какие клетки карты пересекает прямоугольник
    let left = Math.floor(x / tileSize);
    let right = Math.floor((x + w - 1) / tileSize);
    let top = Math.floor(y / tileSize);
    let bottom = Math.floor((y + h - 1) / tileSize);
    
    // Защита от выхода за границы карты
    const rows = map.length;
    const cols = map[0].length;
    left = Math.max(0, left);
    right = Math.min(cols - 1, right);
    top = Math.max(0, top);
    bottom = Math.min(rows - 1, bottom);
    
    // Проверяем все клетки в зоне прямоугольника
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (map[i][j] === 1) return true;
        }
    }
    return false;
}

/**
 * Пытается переместить объект, проверяя столкновения по отдельным осям
 * @param {Object} obj - объект с полями x, y, w, h
 * @param {number} dx - смещение по оси X
 * @param {number} dy - смещение по оси Y
 * @param {Array<Array<number>>} map - карта уровня
 * @param {number} tileSize - размер клетки
 */
function tryMove(obj, dx, dy, map, tileSize) {
    // Проверяем движение по горизонтали
    const newX = obj.x + dx;
    if (!isSolid(newX, obj.y, obj.w, obj.h, map, tileSize)) {
        obj.x = newX;
    }
    
    // Проверяем движение по вертикали
    const newY = obj.y + dy;
    if (!isSolid(obj.x, newY, obj.w, obj.h, map, tileSize)) {
        obj.y = newY;
    }
}

// ---------- СТОЛКНОВЕНИЯ МЕЖДУ ОБЪЕКТАМИ ----------

/**
 * Проверяет, пересекаются ли два прямоугольника (AABB collision)
 * @param {Object} a - объект 1 (поля x, y, w, h)
 * @param {Object} b - объект 2 (поля x, y, w, h)
 * @returns {boolean} true - пересекаются, false - нет
 */
function isColliding(a, b) {
    return (a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y);
}

/**
 * Проверяет, находится ли объект в пределах экрана
 * @param {Object} obj - объект с полями x, y, w, h
 * @param {number} width - ширина экрана
 * @param {number} height - высота экрана
 * @returns {boolean} true - внутри экрана
 */
function isWithinBounds(obj, width, height) {
    return (obj.x >= 0 && obj.x + obj.w <= width &&
            obj.y >= 0 && obj.y + obj.h <= height);
}

/**
 * Ограничивает позицию объекта границами экрана
 * @param {Object} obj - объект с полями x, y, w, h
 * @param {number} width - ширина экрана
 * @param {number} height - высота экрана
 */
function clampToBounds(obj, width, height) {
    obj.x = Math.max(0, Math.min(obj.x, width - obj.w));
    obj.y = Math.max(0, Math.min(obj.y, height - obj.h));
}

// ---------- ДИСТАНЦИЯ И НАПРАВЛЕНИЕ ----------

/**
 * Вычисляет расстояние между двумя объектами
 * @param {Object} a - объект 1
 * @param {Object} b - объект 2
 * @returns {number} расстояние в пикселях
 */
function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

/**
 * Вычисляет направление от объекта a к объекту b
 * @param {Object} a - от кого
 * @param {Object} b - к кому
 * @returns {{dx: number, dy: number}} нормализованное направление
 */
function directionTo(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return { dx: 0, dy: 0 };
    return { dx: dx / len, dy: dy / len };
}

// ---------- ПРОВЕРКА ЗОНЫ ОБЗОРА (КОНУС) ----------

/**
 * Проверяет, находится ли объект b в конусе обзора объекта a
 * @param {Object} a - объект-наблюдатель (координаты, угол обзора)
 * @param {number} a.x - центр по X
 * @param {number} a.y - центр по Y
 * @param {number} a.viewAngle - угол обзора в градусах (от центра)
 * @param {number} a.viewRadius - радиус обзора в пикселях
 * @param {Object} b - целевой объект
 * @returns {boolean} true - в зоне обзора
 */
function isInCone(a, b, viewAngle, viewRadius) {
    // Проверка расстояния
    const dist = distance(a, b);
    if (dist > viewRadius) return false;
    
    // Вычисляем угол между направлением взгляда и направлением к цели
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const angleToTarget = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Угол взгляда (по умолчанию смотрит вправо, 0 градусов)
    const lookAngle = a.lookAngle || 0;
    
    // Разница углов
    let angleDiff = Math.abs(angleToTarget - lookAngle);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;
    
    return angleDiff <= viewAngle / 2;
}

// ---------- ТОЧЕЧНАЯ ПРОВЕРКА ----------

/**
 * Проверяет, находится ли точка внутри прямоугольника
 * @param {number} px - координата X точки
 * @param {number} py - координата Y точки
 * @param {Object} rect - прямоугольник с полями x, y, w, h
 * @returns {boolean}
 */
function isPointInRect(px, py, rect) {
    return (px >= rect.x && px <= rect.x + rect.w &&
            py >= rect.y && py <= rect.y + rect.h);
}

// Экспорт для использования в других файлах (если используешь модули)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isSolid,
        tryMove,
        isColliding,
        isWithinBounds,
        clampToBounds,
        distance,
        directionTo,
        isInCone,
        isPointInRect
    };
}