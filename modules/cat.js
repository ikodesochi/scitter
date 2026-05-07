// modules/cat.js
// Модуль кота: патрулирование, преследование, нападение, импостер-режим

// ---------- ПЕРЕМЕННЫЕ КОТА ----------
let cat = {
    x: 300, y: 300,           // позиция (в пикселях)
    w: 32, h: 32,             // размеры (ширина, высота)
    speed: 2.2,               // текущая скорость
    isAggressive: false,      // агрессивный режим (преследует мышь)
    isAlive: true,            // жив ли кот (для импостера / убийства собакой)
    viewRadius: 150,          // радиус обзора (для будущих механик)
    viewAngle: 90,            // угол обзора в градусах
    lookAngle: 0,             // текущий угол взгляда (для конуса)
    teleportCooldown: 0,      // задержка телепортации (для сложных уровней)
    type: "normal"            // "normal" или "imposter"
};

// Второй кот (импостер), появляется на некоторых уровнях
let imposter = {
    x: 500, y: 400,
    w: 32, h: 32,
    speed: 1.8,
    isAggressive: true,
    isAlive: true,
    type: "imposter",
    glowTimer: 0,             // красное свечение (подсказка игроку)
    ignoreCheese: true        // импостер не интересуется сыром
};

// ---------- НАСТРОЙКИ КОТА (ЗАГРУЖАЮТСЯ ИЗ УРОВНЯ) ----------
function setCatSettings(settings) {
    if (!settings) return;
    
    cat.isAggressive = settings.isAggressive || false;
    cat.speed = settings.speed || 2.2;
    cat.viewRadius = settings.viewRadius || 150;
    cat.viewAngle = settings.viewAngle || 90;
}

// ---------- ПОЗИЦИОНИРОВАНИЕ (СТАРТ) ----------
function setCatPosition(x, y) {
    cat.x = x;
    cat.y = y;
}

function setImposterPosition(x, y) {
    imposter.x = x;
    imposter.y = y;
}

// ---------- ПОВЕДЕНИЕ КОТА ----------
// Обновление позиции кота (вызывается каждый кадр)
function updateCat(mouse, map, tileSize, tryMoveFn) {
    if (!cat.isAlive) return;
    
    if (cat.isAggressive) {
        // Агрессивный режим: преследование мыши
        const dx = mouse.x - cat.x;
        const dy = mouse.y - cat.y;
        const len = Math.hypot(dx, dy);
        
        if (len > 0.5) {
            const step = Math.min(cat.speed, len);
            const moveX = (dx / len) * step;
            const moveY = (dy / len) * step;
            tryMoveFn(cat, moveX, moveY, map, tileSize);
        }
    } else {
        // Спокойный режим: случайное блуждание
        if (Math.random() < 0.02) {
            const angle = Math.random() * Math.PI * 2;
            const moveX = Math.cos(angle) * cat.speed;
            const moveY = Math.sin(angle) * cat.speed;
            tryMoveFn(cat, moveX, moveY, map, tileSize);
        }
    }
    
    // Обновляем угол взгляда (всегда смотрит в сторону движения)
    // Для простоты используем последнее направление, если кот двигался
    // (можно расширить для конуса обзора)
}

// ---------- ИМПОСТЕР (ВТОРОЙ КОТ) ----------
function updateImposter(mouse, map, tileSize, tryMoveFn) {
    if (!imposter.isAlive) return;
    
    // Импостер иногда замирает и светится красным
    if (Math.random() < 0.01 && imposter.glowTimer === 0) {
        imposter.glowTimer = 30;  // светимся 30 кадров
    }
    
    if (imposter.glowTimer > 0) {
        imposter.glowTimer--;
    }
    
    // Импостер преследует мышь, но медленнее обычного кота
    const dx = mouse.x - imposter.x;
    const dy = mouse.y - imposter.y;
    const len = Math.hypot(dx, dy);
    
    if (len > 0.5 && imposter.isAggressive) {
        const step = Math.min(imposter.speed, len);
        const moveX = (dx / len) * step;
        const moveY = (dy / len) * step;
        tryMoveFn(imposter, moveX, moveY, map, tileSize);
    }
}

// ---------- ПРОВЕРКА СТОЛКНОВЕНИЙ С МЫШЬЮ ----------
function checkCatCollision(mouse, onCollisionCallback) {
    if (!cat.isAlive) return false;
    
    // Проверка пересечения прямоугольников
    if (cat.x < mouse.x + mouse.w &&
        cat.x + cat.w > mouse.x &&
        cat.y < mouse.y + mouse.h &&
        cat.y + cat.h > mouse.y) {
        onCollisionCallback();
        return true;
    }
    return false;
}

function checkImposterCollision(mouse, onCollisionCallback) {
    if (!imposter.isAlive) return false;
    
    if (imposter.x < mouse.x + mouse.w &&
        imposter.x + imposter.w > mouse.x &&
        imposter.y < mouse.y + mouse.h &&
        imposter.y + imposter.h > mouse.y) {
        onCollisionCallback();
        return true;
    }
    return false;
}

// ---------- АТАКА СОБАКИ НА КОТА ----------
function attackCat(dog, dogFullness, protectionRadius) {
    if (!cat.isAlive) return false;
    
    // Если собака сыта и кот рядом
    if (dogFullness > 0 && cat.isAlive) {
        const dx = cat.x - dog.x;
        const dy = cat.y - dog.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < protectionRadius) {
            // Собака атакует кота
            cat.isAlive = false;
            return true;
        }
    }
    return false;
}

function attackImposter(dog, dogFullness, protectionRadius) {
    if (!imposter.isAlive) return false;
    
    if (dogFullness > 0 && imposter.isAlive) {
        const dx = imposter.x - dog.x;
        const dy = imposter.y - dog.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < protectionRadius) {
            imposter.isAlive = false;
            return true;
        }
    }
    return false;
}

// ---------- ВОЗРОЖДЕНИЕ КОТОВ (ПРИ ПЕРЕХОДЕ УРОВНЯ) ----------
function resetCats() {
    cat.isAlive = true;
    imposter.isAlive = true;
    imposter.glowTimer = 0;
}

// ---------- ПРОВЕРКА, ВИДИТ ЛИ КОТ МЫШЬ (ДЛЯ МЕХАНИКИ "ВЗГЛЯД") ----------
function isMouseInSight(mouse) {
    if (!cat.isAlive) return false;
    
    // Проверка расстояния
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance > cat.viewRadius) return false;
    
    // Угол между направлением взгляда кота и направлением к мыши
    // Для простоты пока считаем, что кот видит во все стороны (360 градусов)
    // В будущем можно добавить конус зрения
    return true;
}

// ---------- ОТРИСОВКА ----------
function drawCat(ctx, catSprite = null) {
    if (!cat.isAlive) return;
    
    if (catSprite) {
        ctx.drawImage(catSprite, cat.x, cat.y, cat.w, cat.h);
    } else {
        // Временный прямоугольник для тестирования
        ctx.fillStyle = '#2a6a2a';
        ctx.fillRect(cat.x, cat.y, cat.w, cat.h);
        ctx.fillStyle = '#88ff88';
        ctx.font = '26px monospace';
        ctx.fillText('🐱', cat.x + 6, cat.y + 28);
    }
}

function drawImposter(ctx, imposterSprite = null) {
    if (!imposter.isAlive) return;
    
    if (imposterSprite) {
        ctx.drawImage(imposterSprite, imposter.x, imposter.y, imposter.w, imposter.h);
    } else {
        ctx.fillStyle = imposter.glowTimer > 0 ? '#aa44aa' : '#6a2a6a';
        ctx.fillRect(imposter.x, imposter.y, imposter.w, imposter.h);
        
        if (imposter.glowTimer > 0) {
            ctx.fillStyle = '#ff88ff';
        } else {
            ctx.fillStyle = '#88ff88';
        }
        ctx.font = '26px monospace';
        ctx.fillText('👾', imposter.x + 6, imposter.y + 28);
    }
}

// ---------- ЭКСПОРТ (ДЛЯ game.js) ----------
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cat,
        imposter,
        setCatSettings,
        setCatPosition,
        setImposterPosition,
        updateCat,
        updateImposter,
        checkCatCollision,
        checkImposterCollision,
        attackCat,
        attackImposter,
        resetCats,
        isMouseInSight,
        drawCat,
        drawImposter
    };
}