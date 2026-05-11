// physics.js — Модуль физики и движения
 
// ---------- УСКОРЕНИЕ И СКОРОСТЬ ----------
// Плавное ускорение мыши (нажали клавишу — скорость растёт)
function updateMouseAcceleration(mouse, keys, acceleration, maxSpeed) {
    let dx = 0, dy = 0;
    
    // Определяем направление
    if (keys.ArrowLeft || keys.KeyA) dx = -1;
    if (keys.ArrowRight || keys.KeyD) dx = 1;
    if (keys.ArrowUp || keys.KeyW) dy = -1;
    if (keys.ArrowDown || keys.KeyS) dy = 1;
    
    // Нормализация для диагонали 
    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }
    
    // Ускорение
    mouse.vx += dx * acceleration;
    mouse.vy += dy * acceleration;
    
    // Ограничение максимальной скорости
    let speed = Math.hypot(mouse.vx, mouse.vy);
    if (speed > maxSpeed) {
        mouse.vx = (mouse.vx / speed) * maxSpeed;
        mouse.vy = (mouse.vy / speed) * maxSpeed;
    }
    
    // Трение (если клавиши не нажаты — замедление)
    if (dx === 0 && dy === 0) {
        mouse.vx *= 0.98;
        mouse.vy *= 0.98;
    }
}

// ---------- ДВИЖЕНИЕ МЫШИ ----------
function moveMouse(mouse, map, tileSize, isSolidFn) {
    // Временные новые координаты
    let newX = mouse.x + mouse.vx;
    let newY = mouse.y + mouse.vy;
    
    // Проверка столкновений по отдельным осям (скольжение вдоль стен)
    if (!isSolidFn(newX, mouse.y, mouse.width, mouse.height, map, tileSize)) {
        mouse.x = newX;
    }
    if (!isSolidFn(mouse.x, newY, mouse.width, mouse.height, map, tileSize)) {
        mouse.y = newY;
    }
}

// ---------- ЭФФЕКТ СТРАХА ----------
// Скорость мыши падает, когда кот близко
function updateFearEffect(mouse, cat, maxDistance = 200) {
    const dx = cat.x - mouse.x;
    const dy = cat.y - mouse.y;
    const distance = Math.hypot(dx, dy);
    
    let fear = 0;
    if (distance < maxDistance) {
        fear = (1 - distance / maxDistance) * 100;
    }
    
    mouse.fear = Math.min(100, Math.max(0, fear));
    // Скорость падает пропорционально страху
    mouse.currentSpeed = mouse.baseSpeed * (1 - mouse.fear / 150);
    if (mouse.currentSpeed < 1) mouse.currentSpeed = 1;
}

// ---------- ДВИЖЕНИЕ КОТА (ИИ, преследование) ----------
function moveCat(cat, mouse, map, tileSize, isSolidFn) {
    // Направление к мыши
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance > 0.5) {
        const step = Math.min(cat.speed, distance);
        const moveX = (dx / distance) * step;
        const moveY = (dy / distance) * step;
        
        // Движение с проверкой стен
        let newX = cat.x + moveX;
        let newY = cat.y + moveY;
        
        if (!isSolidFn(newX, cat.y, cat.width, cat.height, map, tileSize)) {
            cat.x = newX;
        }
        if (!isSolidFn(cat.x, newY, cat.width, cat.height, map, tileSize)) {
            cat.y = newY;
        }
    }
}

// ---------- УГОЛ ЗРЕНИЯ КОТА (конус) ----------
function isMouseInCone(cat, mouse, viewAngle = 90, viewRadius = 200) {
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance > viewRadius) return false;
    
    // Угол между направлением кота и мышью (пока упрощённо: смотрит всегда вперёд)
    // Для простоты считаем, что кот видит во все стороны (все 360 градусов)
    // Можно доработать под конкретный угол зрения
    return true;
}

// ---------- ЭФФЕКТ СКОЛЬЖЕНИЯ (лужа масла) ----------
function applyOilSlick(mouse, intensity = 0.5) {
    // Уменьшаем трение и управляемость
    mouse.vx *= intensity;
    mouse.vy *= intensity;
}

// ---------- ПРОВЕРКА СТОЛКНОВЕНИЙ (прямоугольники) ----------
function isColliding(a, b) {
    return (a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y);
}

// ---------- РАССТОЯНИЕ МЕЖДУ ОБЪЕКТАМИ ----------
function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

// ---------- ПРОВЕРКА СТЕН ----------
function isSolid(x, y, w, h, map, tileSize) {
    const left = Math.floor(x / tileSize);
    const right = Math.floor((x + w - 1) / tileSize);
    const top = Math.floor(y / tileSize);
    const bottom = Math.floor((y + h - 1) / tileSize);
    
    const rows = map.length;
    const cols = map[0].length;
    
    // Защита от выхода за границы
    const l = Math.max(0, left);
    const r = Math.min(cols - 1, right);
    const t = Math.max(0, top);
    const b = Math.min(rows - 1, bottom);
    
    for (let i = t; i <= b; i++) {
        for (let j = l; j <= r; j++) {
            if (map[i][j] === 1) return true;
        }
    }
    return false;
}

// ---------- ЭКСПОРТ (для game.js) ----------
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateMouseAcceleration,
        moveMouse,
        updateFearEffect,
        moveCat,
        isMouseInCone,
        applyOilSlick,
        isColliding,
        distance,
        isSolid
    };
}