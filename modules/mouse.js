// modules/mouse.js
// Модуль мыши: движение, сбор предметов, страх, скорость

// ---------- ПЕРЕМЕННЫЕ МЫШИ ----------
let mouse = {
    x: 100, y: 100,           // позиция (в пикселях)
    w: 28, h: 28,             // размеры (ширина, высота)
    speed: 4,                 // текущая скорость
    baseSpeed: 4,             // базовая скорость (без страха)
    fear: 0,                  // уровень страха (0–100)
    isAlive: true             // жива ли мышь
};

// ---------- УПРАВЛЕНИЕ КЛАВИШАМИ ----------
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false
};

// Обработка нажатий клавиш (вызывается один раз при загрузке)
function initMouseControls() {
    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });
}

// Получение направления движения по нажатым клавишам
function getMovementDirection() {
    let dx = 0, dy = 0;
    
    if (keys.ArrowLeft || keys.KeyA) dx = -1;
    if (keys.ArrowRight || keys.KeyD) dx = 1;
    if (keys.ArrowUp || keys.KeyW) dy = -1;
    if (keys.ArrowDown || keys.KeyS) dy = 1;
    
    // Нормализация для диагонали (чтобы скорость по диагонали не была выше)
    if (dx !== 0 && dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
    }
    
    return { dx, dy };
}

// Обновление позиции мыши (с проверкой стен)
function updateMousePosition(map, tileSize, tryMoveFn) {
    if (!mouse.isAlive) return;
    
    const { dx, dy } = getMovementDirection();
    const moveX = dx * mouse.speed;
    const moveY = dy * mouse.speed;
    
    // Используем переданную функцию tryMove из collision.js
    tryMoveFn(mouse, moveX, moveY, map, tileSize);
}

// ---------- СБОР ПРЕДМЕТОВ ----------
function collectCheese(cheese, cheeseCallback) {
    if (!mouse.isAlive) return false;
    
    if (isColliding(mouse, cheese)) {
        cheeseCallback();  // вызываем функцию сбора (обычно увеличивает счёт)
        return true;
    }
    return false;
}

function collectBone(bone, boneCallback) {
    if (!mouse.isAlive) return false;
    
    if (isColliding(mouse, bone)) {
        boneCallback();
        return true;
    }
    return false;
}

// ---------- МЕХАНИКА СТРАХА ----------
// Обновление уровня страха в зависимости от расстояния до кота
function updateFear(cat, maxFearDistance = 150) {
    if (!mouse.isAlive) return;
    
    // Вычисляем расстояние до кота
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance < maxFearDistance) {
        // Чем ближе кот, тем быстрее растёт страх
        const fearIncrease = (maxFearDistance - distance) / maxFearDistance * 2;
        mouse.fear = Math.min(100, mouse.fear + fearIncrease);
    } else {
        // Страх медленно спадает
        mouse.fear = Math.max(0, mouse.fear - 0.5);
    }
    
    // Скорость мыши зависит от страха
    // Чем выше страх, тем медленнее мышь
    mouse.speed = mouse.baseSpeed * (1 - mouse.fear / 150);
    mouse.speed = Math.max(mouse.speed, 1); // минимум 1 пиксель за кадр
}

// Сброс страха (например, при переходе на новый уровень)
function resetFear() {
    mouse.fear = 0;
    mouse.speed = mouse.baseSpeed;
}

// ---------- ДВИГАТЕЛЬ (ОСНОВНАЯ ФУНКЦИЯ) ----------
// Вызывается каждый кадр из game.js
function updateMouse(map, tileSize, tryMoveFn, cat, enableFear = false) {
    if (!mouse.isAlive) return;
    
    updateMousePosition(map, tileSize, tryMoveFn);
    
    if (enableFear) {
        updateFear(cat);
    }
}

// ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (для других модулей) ----------
function getMouseBounds() {
    return {
        x: mouse.x,
        y: mouse.y,
        w: mouse.w,
        h: mouse.h
    };
}

function reviveMouse(x, y) {
    mouse.x = x;
    mouse.y = y;
    mouse.isAlive = true;
    resetFear();
}

function killMouse() {
    mouse.isAlive = false;
}

// ---------- ОТРИСОВКА (вызывается из game.js) ----------
function drawMouse(ctx, mouseSprite = null) {
    if (!mouse.isAlive) return;
    
    if (mouseSprite) {
        // Если есть загруженный спрайт
        ctx.drawImage(mouseSprite, mouse.x, mouse.y, mouse.w, mouse.h);
    } else {
        // Временный прямоугольник (для тестирования)
        ctx.fillStyle = '#aa8866';
        ctx.fillRect(mouse.x, mouse.y, mouse.w, mouse.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px monospace';
        ctx.fillText('🐭', mouse.x + 6, mouse.y + 22);
    }
}

// Экспорт для использования в game.js (если используете модули)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mouse,
        initMouseControls,
        updateMouse,
        collectCheese,
        collectBone,
        updateFear,
        resetFear,
        getMouseBounds,
        reviveMouse,
        killMouse,
        drawMouse
    };
}