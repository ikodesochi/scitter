// levels/level_meeting.js
// Уровень 1: Подземелье — лабиринт с комнатами

export const levelInfo = {
    id: 1,
    name: "Подземелье",
    cheeseGoal: 8,
    boneGoal: 0,
    catSpeed: 1.5,
    catAggression: 0,
    dogEnabled: false
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
    
    // Комнаты
    buildRoom(map, 3, 3, 18, 11, [{r: 10, c: 12}, {r: 3, c: 7}]);
    buildRoom(map, 3, 13, 10, 24, [{r: 7, c: 25}, {r: 10, c: 18}, {r: 10, c: 22}]);
    buildRoom(map, 13, 13, 28, 35, [{r: 20, c: 25}, {r: 13, c: 18}, {r: 13, c: 30}, {r: 28, c: 32}]);
    buildRoom(map, 3, 36, 20, 39, [{r: 12, c: 40}, {r: 20, c: 38}]);
    buildRoom(map, 32, 4, 48, 14, [{r: 40, c: 15}, {r: 48, c: 8}, {r: 35, c: 7}]);
    buildRoom(map, 32, 36, 45, 39, [{r: 38, c: 40}, {r: 45, c: 37}]);
    
    // Коридоры
    buildHCorridor(map, 29, 16, 30, [22, 28]);
    buildHCorridor(map, 31, 26, 35, [30]);
    buildVCorridor(map, 8, 22, 28, [25]);
    buildHCorridor(map, 22, 3, 7, [5]);
    
    // Декор
    for (let i = 3; i < rows - 3; i += 4) {
        for (let j = 3; j < cols - 3; j += 4) {
            if (map[i][j] === 0 && Math.random() < 0.3) {
                map[i][j] = Math.random() < 0.5 ? 2 : 5;
            }
        }
    }
    
    return map;
}

function buildRoom(map, rs, cs, re, ce, doors) {
    for (let i = rs; i <= re; i++) { map[i][cs] = 1; map[i][ce] = 1; }
    for (let j = cs; j <= ce; j++) { map[rs][j] = 1; map[re][j] = 1; }
    for (const d of doors) map[d.r][d.c] = 0;
}

function buildHCorridor(map, row, cs, ce, doors) {
    for (let j = cs; j <= ce; j++) map[row][j] = 1;
    for (const d of doors) map[row][d] = 0;
}

function buildVCorridor(map, col, rs, re, doors) {
    for (let i = rs; i <= re; i++) map[i][col] = 1;
    for (const d of doors) map[d][col] = 0;
}

export function getItemPositions(tileSize, rows, cols) {
    const spots = [
        { x: 7, y: 5 }, { x: 18, y: 7 }, { x: 21, y: 6 },
        { x: 28, y: 17 }, { x: 33, y: 15 }, { x: 45, y: 5 },
        { x: 7, y: 38 }, { x: 44, y: 35 }, { x: 5, y: 28 },
        { x: 25, y: 18 }, { x: 42, y: 8 }, { x: 36, y: 42 }
    ];
    
    return {
        cheeses: spots.slice(0, 8).map(s => ({ x: s.x * tileSize + 10, y: s.y * tileSize + 10 })),
        bones: [],
        hole: { x: (cols - 2) * tileSize - 10, y: (rows - 2) * tileSize - 10 }
    };
}

export function getStartPositions(tileSize, rows, cols) {
    return {
        mouse: { x: 2 * tileSize + 5, y: 2 * tileSize + 5 },
        cat: { x: 32 * tileSize, y: 18 * tileSize },
        dog: { x: 0, y: 0 }
    };
}