// levels/sewer.js
export const sewerMap = (rows, cols) => {
    let map = Array(rows).fill().map(() => Array(cols).fill(1));
    for (let i = 0; i < rows; i++) map[i][0] = map[i][cols-1] = 1;
    for (let j = 0; j < cols; j++) map[0][j] = map[rows-1][j] = 1;
    const mid = Math.floor(cols / 2);
    for (let i = 1; i < rows-1; i++) map[i][mid] = 0;
    return map;
};

export const sewerCheese = (cols, rows, tileSize) => ({
    x: Math.floor(cols / 2) * tileSize + 8,
    y: (rows - 2) * tileSize + 8,
    w: 25, h: 25,
    active: true
});