// levels/level_darkness.js
// Уровень 2: Темнота — кромешная тьма, только маленький круг света вокруг мыши
// Страх накапливается быстро, нужно прятаться в комнатах-убежищах

export const levelInfo = {
    id: 2,
    name: "Темнота",
    cheeseGoal: 6,          // Меньше сыра — уровень сложнее из-за темноты
    boneGoal: 2,             // Меньше костей
    catSpeed: 2.0,           // Кот быстрее чем на первом уровне
    catAggression: 1,
    darknessEnabled: true,   // Включаем систему темноты
    visionRadius: 160,  // Очень узкий обзор — всего 60 пикселей вокруг мыши
    dogEnabled: false        // Без собаки — мышь одинока в темноте
};

export function buildMap(rows, cols) {
    let map = Array(rows).fill().map(() => Array(cols).fill(0));
    
    // Внешние стены
    for (let i = 0; i < rows; i++) {
        map[i][0] = 1;
        map[i][cols - 1] = 1;
    }
    for (let j = 0; j < cols; j++) {
        map[0][j] = 1;
        map[rows - 1][j] = 1;
    }
    
    // Плотный лабиринт из узких коридоров
    // Стены через каждые 3-4 тайла создают тесные проходы
    for (let i = 3; i < rows - 3; i += 4) {
        for (let j = 3; j < cols - 3; j += 4) {
            if (Math.random() < 0.7) {
                // Горизонтальная стена
                const len = Math.floor(Math.random() * 3) + 2;
                for (let k = j; k < Math.min(j + len, cols - 3); k++) {
                    if (map[i][k] === 0) map[i][k] = 1;
                }
                // Обязательный проход в стене
                const hole = j + Math.floor(Math.random() * len);
                if (hole < cols - 3) map[i][hole] = 0;
            }
            if (Math.random() < 0.7) {
                // Вертикальная стена
                const len = Math.floor(Math.random() * 3) + 2;
                for (let k = i; k < Math.min(i + len, rows - 3); k++) {
                    if (map[k][j] === 0) map[k][j] = 1;
                }
                // Обязательный проход
                const hole = i + Math.floor(Math.random() * len);
                if (hole < rows - 3) map[hole][j] = 0;
            }
        }
    }
    
    // Комнаты-убежища (4 безопасные зоны по углам)
    const safeRooms = [
        { r: 3, c: 3, w: 4, h: 4 },           // Левый верх
        { r: 3, c: cols - 7, w: 4, h: 4 },     // Правый верх
        { r: rows - 7, c: 3, w: 4, h: 4 },     // Левый низ
        { r: rows - 7, c: cols - 7, w: 4, h: 4 } // Правый низ
    ];
    
    for (const room of safeRooms) {
        // Очищаем комнату от стен
        for (let i = room.r; i < room.r + room.h; i++) {
            for (let j = room.c; j < room.c + room.w; j++) {
                map[i][j] = 0;
            }
        }
        // Делаем двери с каждой стороны
        const midR = room.r + Math.floor(room.h / 2);
        const midC = room.c + Math.floor(room.w / 2);
        map[midR][room.c] = 0;              // Левая дверь
        map[midR][room.c + room.w - 1] = 0; // Правая дверь
        map[room.r][midC] = 0;              // Верхняя дверь
        map[room.r + room.h - 1][midC] = 0; // Нижняя дверь
    }
    
    // Ящики как укрытия (за ними можно спрятаться от кота)
    for (let i = 2; i < rows - 2; i++) {
        for (let j = 2; j < cols - 2; j++) {
            if (map[i][j] === 0 && Math.random() < 0.06) {
                map[i][j] = 5; // Ящик
            }
        }
    }
    
    return map;
}

export function getItemPositions(tileSize, rows, cols) {
    const cheeses = [];
    const bones = [];
    
    // Сыр в основном в безопасных комнатах
    cheeses.push({ x: 4 * tileSize + 10, y: 4 * tileSize + 10 });                   // Лево-верх
    cheeses.push({ x: (cols - 5) * tileSize + 10, y: 4 * tileSize + 10 });           // Право-верх
    cheeses.push({ x: 4 * tileSize + 10, y: (rows - 5) * tileSize + 10 });           // Лево-низ
    cheeses.push({ x: (cols - 5) * tileSize + 10, y: (rows - 5) * tileSize + 10 }); // Право-низ
    
    // Остальные разбросаны по карте
    for (let i = 0; i < 4; i++) {
        cheeses.push({
            x: (8 + i * 10) * tileSize + 10,
            y: (8 + (i % 2) * 15) * tileSize + 10
        });
    }
    
    // Кости тоже в безопасных местах
    bones.push({ x: 6 * tileSize + 10, y: 6 * tileSize + 10 });
    bones.push({ x: (cols - 7) * tileSize + 10, y: (rows - 7) * tileSize + 10 });
    
    return {
        cheeses,
        bones,
        hole: { x: Math.floor(cols / 2) * tileSize - 20, y: (rows - 2) * tileSize - 10 }
    };
}

export function getStartPositions(tileSize, rows, cols) {
    return {
        // Мышь начинает в центре карты
        mouse: { x: Math.floor(cols / 2) * tileSize + 5, y: Math.floor(rows / 2) * tileSize + 5 },
        // Кот начинает в углу — есть время осмотреться
        cat: { x: 5 * tileSize, y: 5 * tileSize },
        dog: { x: 0, y: 0 }
    };
}