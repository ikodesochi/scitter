// modules/dog.js
// Модуль собаки-защитника: сытость, патрулирование, атака котов

// ---------- ПЕРЕМЕННЫЕ СОБАКИ ----------
let dog = {
    x: 500, y: 500,           // позиция (в пикселях)
    w: 36, h: 36,             // размеры (чуть больше кота)
    speed: 1.5,               // скорость передвижения
    fullness: 100,            // сытость (0–100)
    maxFullness: 100,         // максимальная сытость
    isAlive: true,            // жива ли собака
    isProtecting: true,       // защищает ли мышь (да, если сытость > 0)
    protectionRadius: 80,     // радиус защиты (в пикселях)
    patrolMode: true,         // патрулирует ли территорию
    patrolPoints: [],         // точки патрулирования (x, y)
    currentPatrolIndex: 0     // текущая точка патрулирования
};

// ---------- НАСТРОЙКИ СОБАКИ (ЗАГРУЖАЮТСЯ ИЗ УРОВНЯ) ----------
function setDogSettings(settings) {
    if (!settings || !settings.enabled) {
        dog.isAlive = false;
        return;
    }
    
    dog.isAlive = true;
    dog.fullness = settings.fullness !== undefined ? settings.fullness : 100;
    dog.protectionRadius = settings.protectionRadius || 80;
    dog.speed = settings.speed || 1.5;
    dog.patrolMode = settings.patrolMode !== undefined ? settings.patrolMode : true;
}

// ---------- ПОЗИЦИОНИРОВАНИЕ ----------
function setDogPosition(x, y) {
    dog.x = x;
    dog.y = y;
}

function setDogPatrolPoints(points) {
    dog.patrolPoints = points;
    dog.currentPatrolIndex = 0;
}

// ---------- СЫТОСТЬ ----------
// Уменьшение сытости со временем (вызывается каждый кадр)
function decreaseFullness(rate = 0.05) {
    if (!dog.isAlive) return;
    
    dog.fullness = Math.max(0, dog.fullness - rate);
    dog.isProtecting = dog.fullness > 0;
}

// Увеличение сытости (когда мышь приносит кость)
function increaseFullness(amount = 20) {
    if (!dog.isAlive) return;
    
    dog.fullness = Math.min(dog.maxFullness, dog.fullness + amount);
    dog.isProtecting = dog.fullness > 0;
}

// Получение текущей сытости (для отрисовки шкалы)
function getFullnessPercent() {
    return (dog.fullness / dog.maxFullness) * 100;
}

// ---------- ПАТРУЛИРОВАНИЕ ----------
function updateDogPatrol(map, tileSize, tryMoveFn) {
    if (!dog.isAlive) return false;
    if (!dog.patrolMode) return false;
    if (dog.patrolPoints.length === 0) return false;
    
    // Текущая цель
    const target = dog.patrolPoints[dog.currentPatrolIndex];
    if (!target) return false;
    
    // Вычисляем направление к цели
    const dx = target.x - dog.x;
    const dy = target.y - dog.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance < 10) {
        // Дошли до точки, переключаемся на следующую
        dog.currentPatrolIndex = (dog.currentPatrolIndex + 1) % dog.patrolPoints.length;
        return true;
    }
    
    // Движение к цели
    const step = Math.min(dog.speed, distance);
    const moveX = (dx / distance) * step;
    const moveY = (dy / distance) * step;
    tryMoveFn(dog, moveX, moveY, map, tileSize);
    
    return true;
}

// ---------- ЗАЩИТА МЫШИ ----------
// Проверка, находится ли мышь в радиусе защиты
function isMouseInProtectionRadius(mouse) {
    if (!dog.isAlive) return false;
    if (!dog.isProtecting) return false;
    
    const dx = mouse.x - dog.x;
    const dy = mouse.y - dog.y;
    const distance = Math.hypot(dx, dy);
    
    return distance <= dog.protectionRadius;
}

// Атака кота, если он в радиусе защиты
function attackCatIfNearby(cat, tryMoveCatBack = true) {
    if (!dog.isAlive) return false;
    if (!dog.isProtecting) return false;
    
    const dx = cat.x - dog.x;
    const dy = cat.y - dog.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance <= dog.protectionRadius) {
        // Собака атакует кота — кот отбрасывается
        if (tryMoveCatBack) {
            // Отодвигаем кота от собаки
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * 30;
            const pushY = Math.sin(angle) * 30;
            cat.x += pushX;
            cat.y += pushY;
        }
        // Сытость собаки немного уменьшается за атаку
        dog.fullness = Math.max(0, dog.fullness - 5);
        dog.isProtecting = dog.fullness > 0;
        return true;
    }
    return false;
}

// Атака импостера
function attackImposterIfNearby(imposter, tryMoveImposterBack = true) {
    if (!dog.isAlive) return false;
    if (!dog.isProtecting) return false;
    
    const dx = imposter.x - dog.x;
    const dy = imposter.y - dog.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance <= dog.protectionRadius) {
        if (tryMoveImposterBack) {
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * 30;
            const pushY = Math.sin(angle) * 30;
            imposter.x += pushX;
            imposter.y += pushY;
        }
        dog.fullness = Math.max(0, dog.fullness - 5);
        dog.isProtecting = dog.fullness > 0;
        return true;
    }
    return false;
}

// ---------- ПОВЕДЕНИЕ ПРИ ГОЛОДЕ ----------
// Когда сытость падает до нуля, собака либо засыпает, либо уходит
function handleStarving() {
    if (!dog.isAlive) return;
    
    if (dog.fullness <= 0) {
        dog.isProtecting = false;
        // Собака перестаёт двигаться (засыпает)
        dog.speed = 0;
    } else {
        dog.speed = 1.5;
    }
}

// ---------- ВОЗРОЖДЕНИЕ СОБАКИ (ПРИ ПЕРЕХОДЕ УРОВНЯ) ----------
function resetDog() {
    dog.isAlive = true;
    dog.fullness = dog.maxFullness;
    dog.isProtecting = true;
    dog.speed = 1.5;
    dog.currentPatrolIndex = 0;
}

// ---------- ОТРИСОВКА ----------
function drawDog(ctx, dogSprite = null) {
    if (!dog.isAlive) return;
    
    if (dogSprite) {
        ctx.drawImage(dogSprite, dog.x, dog.y, dog.w, dog.h);
    } else {
        // Временный прямоугольник для тестирования
        ctx.fillStyle = dog.isProtecting ? '#8B5A2B' : '#A0A0A0';
        ctx.fillRect(dog.x, dog.y, dog.w, dog.h);
        
        // Индикатор защиты (зелёное свечение, если собака защищает)
        if (dog.isProtecting) {
            ctx.strokeStyle = '#44ff44';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(dog.x + dog.w/2, dog.y + dog.h/2, dog.protectionRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '26px monospace';
        ctx.fillText('🐕', dog.x + 6, dog.y + 28);
    }
}

// ---------- ПОЛУЧЕНИЕ ДАННЫХ ДЛЯ UI ----------
function getDogFullness() {
    return dog.fullness;
}

function isDogProtecting() {
    return dog.isProtecting && dog.isAlive;
}

function isDogAlive() {
    return dog.isAlive;
}

// ---------- ЭКСПОРТ ----------
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        dog,
        setDogSettings,
        setDogPosition,
        setDogPatrolPoints,
        decreaseFullness,
        increaseFullness,
        getFullnessPercent,
        updateDogPatrol,
        isMouseInProtectionRadius,
        attackCatIfNearby,
        attackImposterIfNearby,
        handleStarving,
        resetDog,
        drawDog,
        getDogFullness,
        isDogProtecting,
        isDogAlive
    };
}