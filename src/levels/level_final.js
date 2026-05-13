// levels/level_final.js
// Уровень 6: Финал — невидимый кот-босс в тумане, страх повсюду

export const levelInfo = {
    id: 6,
    name: "Финал",
    cheeseGoal: 5,
    boneGoal: 0,
    catSpeed: 3.5,
    catAggression: 3,
    darknessEnabled: true,
    visionRadius: 70,        // Очень узкий обзор
    bossEnabled: true,
    bossPhases: 3,
    dogEnabled: true,
    catInvisible: true,      // Кот невидим
    fearAura: true           // Объекты краснеют от страха
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
    
    // Тёмная арена с разрушенными стенами
    for (let i = 3; i < rows - 3; i += 5) {
        for (let j = 3; j < cols - 3; j += 5) {
            if (Math.random() < 0.5) {
                map[i][j] = 1; // Обломки стен
                if (Math.random() < 0.5) map[i][j+1] = 1;
                if (Math.random() < 0.5) map[i+1][j] = 1;
            }
        }
    }
    
    // Убежища по углам
    const corners = [
        { r: 3, c: 3 }, { r: 3, c: cols-4 },
        { r: rows-4, c: 3 }, { r: rows-4, c: cols-4 }
    ];
    for (const corner of corners) {
        for (let i = corner.r; i < corner.r + 3; i++) {
            for (let j = corner.c; j < corner.c + 3; j++) {
                map[i][j] = 0;
            }
        }
    }
    
    // Ящики (могут краснеть от страха)
    for (let i = 2; i < rows - 2; i++) {
        for (let j = 2; j < cols - 2; j++) {
            if (map[i][j] === 0 && Math.random() < 0.06) {
                map[i][j] = 5;
            }
        }
    }
    
    return map;
}

export function getItemPositions(tileSize, rows, cols) {
    return {
        cheeses: [
            { x: 5 * tileSize + 10, y: 5 * tileSize + 10 },
            { x: (cols-6) * tileSize + 10, y: 5 * tileSize + 10 },
            { x: 5 * tileSize + 10, y: (rows-6) * tileSize + 10 },
            { x: (cols-6) * tileSize + 10, y: (rows-6) * tileSize + 10 },
            { x: Math.floor(cols/2) * tileSize + 10, y: Math.floor(rows/2) * tileSize + 10 }
        ],
        bones: [],
        hole: { x: Math.floor(cols/2) * tileSize - 20, y: (rows-2) * tileSize - 10 }
    };
}

export function getStartPositions(tileSize, rows, cols) {
    return {
        mouse: { x: Math.floor(cols/2) * tileSize + 5, y: (rows-4) * tileSize + 5 },
        cat: { x: Math.floor(cols/2) * tileSize, y: 5 * tileSize },
        dog: { x: Math.floor(cols/2) * tileSize + 5, y: Math.floor(rows/2) * tileSize + 5 }
    };
}