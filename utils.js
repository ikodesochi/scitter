// utils.js — вспомогательные функции
function getRandomFreeSpot(map, tileSize) {
    const rows = map.length;
    const cols = map[0].length;
    let free = [];
    for (let i = 1; i < rows-1; i++) {
        for (let j = 1; j < cols-1; j++) {
            if (map[i][j] === 0) free.push({ x: j * tileSize, y: i * tileSize });
        }
    }
    if (free.length === 0) return { x: 60, y: 60 };
    let r = Math.floor(Math.random() * free.length);
    return free[r];
}

function isSolid(x, y, w, h, map, tileSize) {
    let left = Math.floor(x / tileSize);
    let right = Math.floor((x + w - 1) / tileSize);
    let top = Math.floor(y / tileSize);
    let bottom = Math.floor((y + h - 1) / tileSize);
    const rows = map.length;
    const cols = map[0].length;
    left = Math.max(0, left);
    right = Math.min(cols-1, right);
    top = Math.max(0, top);
    bottom = Math.min(rows-1, bottom);
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (map[i][j] === 1) return true;
        }
    }
    return false;
}