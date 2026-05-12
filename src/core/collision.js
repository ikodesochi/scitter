// core/collision.js
export function isSolid(x, y, w, h, map, tileSize) {
    const left = Math.max(0, Math.floor(x / tileSize));
    const right = Math.min(map[0].length - 1, Math.floor((x + w - 1) / tileSize));
    const top = Math.max(0, Math.floor(y / tileSize));
    const bottom = Math.min(map.length - 1, Math.floor((y + h - 1) / tileSize));

    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (map[i][j] === 1) return true;
        }
    }
    return false;
}

export function tryMove(obj, dx, dy, map, tileSize, mapData) {
    const newX = obj.x + dx;
    const newY = obj.y + dy;
    if (!isSolid(newX, obj.y, obj.w, obj.h, mapData, tileSize)) obj.x = newX;
    if (!isSolid(obj.x, newY, obj.w, obj.h, mapData, tileSize)) obj.y = newY;
}