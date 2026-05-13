// levels/level_street.js
export const levelInfo = {
    id: 2,
    name: "Улица",
    cheeseGoal: 10,
    boneGoal: 5,
    catSpeed: 2.0,
    catAggression: 1,
    darknessEnabled: false,
    trapsEnabled: false
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
    
    // Дороги (горизонтальные полосы)
    const roadY1 = Math.floor(rows * 0.25);
    const roadY2 = Math.floor(rows * 0.5);
    const roadY3 = Math.floor(rows * 0.75);
    
    for (const roadY of [roadY1, roadY2, roadY3]) {
        for (let j = 3; j < cols - 3; j++) {
            map[roadY][j] = 3;
            map[roadY + 1][j] = 3;
        }
    }
    
    // Вертикальная дорога через центр
    const roadX = Math.floor(cols * 0.5);
    for (let i = 3; i < rows - 3; i++) {
        map[i][roadX] = 3;
        map[i][roadX + 1] = 3;
    }
    
    // Здания
    const buildings = [
        { r: 3, c: 3, w: 8, h: 5, door: {r: 7, c: 6} },
        { r: 3, c: cols - 11, w: 8, h: 5, door: {r: 7, c: cols - 7} },
        { r: rows - 8, c: 3, w: 8, h: 5, door: {r: rows - 4, c: 6} },
        { r: rows - 8, c: cols - 11, w: 8, h: 5, door: {r: rows - 4, c: cols - 7} }
    ];
    
    for (const b of buildings) {
        for (let i = b.r; i < b.r + b.h; i++) {
            for (let j = b.c; j < b.c + b.w; j++) {
                map[i][j] = 4;
            }
        }
        map[b.door.r][b.door.c] = 0;
    }
    
    // Деревья
    for (let i = 2; i < rows - 2; i++) {
        for (let j = 2; j < cols - 2; j++) {
            if (map[i][j] === 0 && Math.random() < 0.12) {
                map[i][j] = 2;
            }
        }
    }
    
    // Ящики
    for (let i = 2; i < rows - 2; i++) {
        for (let j = 2; j < cols - 2; j++) {
            if (map[i][j] === 0 && Math.random() < 0.04) {
                map[i][j] = 5;
            }
        }
    }
    
    return map;
}

export function getItemPositions(tileSize, rows, cols) {
    const cheeses = [];
    const bones = [];
    
    const roadY1 = Math.floor(rows * 0.25);
    const roadY2 = Math.floor(rows * 0.5);
    const roadY3 = Math.floor(rows * 0.75);
    const roadX = Math.floor(cols * 0.5);
    
    // Сыры
    for (let i = 0; i < 15; i++) {
        let x = (5 + i * 3) * tileSize + 10;
        let y = (5 + (i % 3) * 10) * tileSize + 10;
        
        // Не на дорогах
        const tileY = Math.floor(y / tileSize);
        const tileX = Math.floor(x / tileSize);
        if (tileY === roadY1 || tileY === roadY2 || tileY === roadY3 ||
            tileX === roadX || tileX === roadX + 1) {
            y = (tileY + 2) * tileSize + 10;
        }
        
        cheeses.push({ x, y });
    }
    
    // Кости
    for (let i = 0; i < 8; i++) {
        bones.push({
            x: (8 + i * 5) * tileSize + 10,
            y: (rows - 10 - (i % 2) * 8) * tileSize + 10
        });
    }
    
    return {
        cheeses,
        bones,
        hole: { x: (cols - 2) * tileSize - 10, y: (rows - 2) * tileSize - 10 }
    };
}

export function getStartPositions(tileSize, rows, cols) {
    return {
        mouse: { x: 3 * tileSize + 5, y: (rows - 3) * tileSize + 5 },
        cat: { x: (cols - 4) * tileSize, y: 5 * tileSize },
        dog: { x: Math.floor(cols/2) * tileSize, y: Math.floor(rows/2) * tileSize }
    };
}