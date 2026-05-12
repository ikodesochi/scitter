// core/mapGenerator.js
export function generateRandomMap(rows, cols, tileSize) {
    let map = Array(rows).fill().map(() => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) map[i][0] = map[i][cols-1] = 1;
    for (let j = 0; j < cols; j++) map[0][j] = map[rows-1][j] = 1;
    for (let i = 2; i < rows-2; i++) {
        for (let j = 2; j < cols-2; j++) {
            if (Math.random() < 0.2 && !(i === 2 && j === 2)) {
                map[i][j] = 1;
            }
        }
    }
    return map;
}

export function getRandomFreeSpot(map, rows, cols, tileSize) {
    let free = [];
    for (let i = 1; i < rows-1; i++) {
        for (let j = 1; j < cols-1; j++) {
            if (map[i][j] === 0) free.push({ x: j * tileSize, y: i * tileSize });
        }
    }
    return free.length === 0 ? { x: 60, y: 60 } : free[Math.floor(Math.random() * free.length)];
}