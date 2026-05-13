// levels/level_traps.js
// Уровень 5: Ловушки — змейка из туннелей, кот сзади, ловушки внутри
// 5 сегментов, каждый с безопасной зоной в конце

export const levelInfo = {
    id: 5,
    name: "Ловушки",
    cheeseGoal: 10,
    boneGoal: 0,
    catSpeed: 3.0,          // Кот быстрый — нужно спешить
    catAggression: 2,
    trapsEnabled: true,
    dogEnabled: false
};

export function buildMap(rows, cols) {
    let map = Array(rows).fill().map(() => Array(cols).fill(1)); // Всё стены
    
    // Параметры змейки
    const tunnelWidth = 3;   // Ширина туннеля в тайлах
    const segmentLength = 12; // Длина одного сегмента
    const safeZoneSize = 4;   // Размер безопасной зоны
    
    // Точки поворота змейки
    const turns = [
        { x: 6, y: 3 },                    // Старт (левый верх)
        { x: 6, y: 15 },                   // Вниз
        { x: 25, y: 15 },                  // Вправо
        { x: 25, y: 30 },                  // Вниз
        { x: 6, y: 30 },                   // Влево
        { x: 6, y: 45 },                   // Вниз
        { x: 35, y: 45 }                   // Вправо — финиш
    ];
    
    // Строим туннель между точками
    for (let i = 0; i < turns.length - 1; i++) {
        const from = turns[i];
        const to = turns[i + 1];
        
        // Горизонтальный или вертикальный туннель
        if (from.x === to.x) {
            // Вертикальный
            const startY = Math.min(from.y, to.y);
            const endY = Math.max(from.y, to.y);
            for (let y = startY; y <= endY; y++) {
                for (let dx = -Math.floor(tunnelWidth/2); dx <= Math.floor(tunnelWidth/2); dx++) {
                    const tx = from.x + dx;
                    const ty = y;
                    if (tx > 0 && tx < cols-1 && ty > 0 && ty < rows-1) {
                        map[ty][tx] = 0; // Пустой туннель
                    }
                }
            }
        } else {
            // Горизонтальный
            const startX = Math.min(from.x, to.x);
            const endX = Math.max(from.x, to.x);
            for (let x = startX; x <= endX; x++) {
                for (let dy = -Math.floor(tunnelWidth/2); dy <= Math.floor(tunnelWidth/2); dy++) {
                    const tx = x;
                    const ty = from.y + dy;
                    if (tx > 0 && tx < cols-1 && ty > 0 && ty < rows-1) {
                        map[ty][tx] = 0; // Пустой туннель
                    }
                }
            }
        }
        
        // Безопасная зона в точке поворота
        const safeX = to.x;
        const safeY = to.y;
        for (let dy = -safeZoneSize; dy <= safeZoneSize; dy++) {
            for (let dx = -safeZoneSize; dx <= safeZoneSize; dx++) {
                const tx = safeX + dx;
                const ty = safeY + dy;
                if (tx > 0 && tx < cols-1 && ty > 0 && ty < rows-1) {
                    map[ty][tx] = 0; // Безопасная зона
                }
            }
        }
    }
    
    // Ловушки внутри туннелей (не в безопасных зонах)
    for (let i = 0; i < turns.length - 1; i++) {
        const from = turns[i];
        const to = turns[i + 1];
        
        // Ставим ловушки вдоль сегмента
        const trapsCount = 5 + Math.floor(Math.random() * 5);
        for (let t = 0; t < trapsCount; t++) {
            let tx, ty;
            
            if (from.x === to.x) {
                // Вертикальный сегмент
                tx = from.x + (Math.random() < 0.5 ? -1 : 1);
                ty = Math.min(from.y, to.y) + 3 + Math.floor(Math.random() * (Math.abs(to.y - from.y) - 6));
            } else {
                // Горизонтальный сегмент
                tx = Math.min(from.x, to.x) + 3 + Math.floor(Math.random() * (Math.abs(to.x - from.x) - 6));
                ty = from.y + (Math.random() < 0.5 ? -1 : 1);
            }
            
            if (tx > 1 && tx < cols-2 && ty > 1 && ty < rows-2 && map[ty][tx] === 0) {
                // Не ставим ловушку в безопасной зоне
                let inSafeZone = false;
                for (const turn of turns) {
                    if (Math.abs(tx - turn.x) <= safeZoneSize && Math.abs(ty - turn.y) <= safeZoneSize) {
                        inSafeZone = true;
                        break;
                    }
                }
                if (!inSafeZone) {
                    map[ty][tx] = Math.random() < 0.5 ? 3 : 5; // Масло или шипы
                }
            }
        }
    }
    
    // Внешние стены (уже всё стены, просто убеждаемся)
    for (let i = 0; i < rows; i++) {
        map[i][0] = 1;
        map[i][cols - 1] = 1;
    }
    for (let j = 0; j < cols; j++) {
        map[0][j] = 1;
        map[rows - 1][j] = 1;
    }
    
    return map;
}

export function getItemPositions(tileSize, rows, cols) {
    const cheeses = [];
    const turns = [
        { x: 6, y: 3 },
        { x: 6, y: 15 },
        { x: 25, y: 15 },
        { x: 25, y: 30 },
        { x: 6, y: 30 },
        { x: 6, y: 45 },
        { x: 35, y: 45 }
    ];
    
    // Сыр в безопасных зонах и вдоль туннеля
    for (let i = 0; i < turns.length; i++) {
        cheeses.push({
            x: turns[i].x * tileSize + 10,
            y: turns[i].y * tileSize + 10
        });
    }
    
    // Дополнительный сыр
    for (let i = 0; i < 5; i++) {
        cheeses.push({
            x: (10 + i * 8) * tileSize + 10,
            y: (10 + i * 8) * tileSize + 10
        });
    }
    
    return {
        cheeses,
        bones: [],
        hole: { 
            x: turns[turns.length - 1].x * tileSize - tileSize/2, 
            y: turns[turns.length - 1].y * tileSize - tileSize/2 
        }
    };
}

export function getStartPositions(tileSize, rows, cols) {
    const turns = [
        { x: 6, y: 3 },
        { x: 6, y: 15 },
        { x: 25, y: 15 },
        { x: 25, y: 30 },
        { x: 6, y: 30 },
        { x: 6, y: 45 },
        { x: 35, y: 45 }
    ];
    
    return {
        // Мышь в начале змейки
        mouse: { x: 6 * tileSize + 5, y: 3 * tileSize + 5 },
        // Кот в конце змейки — далеко от мыши
        cat: { x: turns[turns.length - 1].x * tileSize, y: turns[turns.length - 1].y * tileSize },
        dog: { x: 0, y: 0 }
    };
}