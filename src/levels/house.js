// levels/house.js
export const houseMap = (rows, cols) => {
    let map = Array(rows).fill().map(() => Array(cols).fill(0));
    // Стены по периметру
    for (let i = 0; i < rows; i++) map[i][0] = map[i][cols-1] = 1;
    for (let j = 0; j < cols; j++) map[0][j] = map[rows-1][j] = 1;
    
    // Внутренние перегородки (комнаты)
    for (let i = 3; i < rows-3; i++) {
        map[i][Math.floor(cols/2)] = 1;  // вертикальная стена
    }
    for (let j = 6; j < cols-6; j++) {
        map[5][j] = 1;  // горизонтальная стена
    }
    
    // Дверной проём
    map[5][Math.floor(cols/2)] = 0;
    
    return map;
};

export const houseItems = (tileSize, rows, cols) => {
    return {
        // Ключ от подвала (можно спрятать)
        key: {
            x: Math.floor(cols/2) * tileSize + tileSize/2,
            y: 2 * tileSize,
            w: 15, h: 15,
            active: true
        },
        // Сундук с сокровищами (финиш локации)
        chest: {
            x: (cols-2) * tileSize,
            y: (rows-2) * tileSize,
            w: 40, h: 40,
            active: true
        }
    };
};