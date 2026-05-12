// levels/street.js

// Улица — почти открытое пространство (только границы)
export const streetMap = (rows, cols) => {
    let map = Array(rows).fill().map(() => Array(cols).fill(0));
    // только внешние стены
    for (let i = 0; i < rows; i++) map[i][0] = map[i][cols-1] = 1;
    for (let j = 0; j < cols; j++) map[0][j] = map[rows-1][j] = 1;
    return map;
};

// Предметы на улице
export const streetItems = (tileSize, rows, cols) => {
    return {
        // Монетки (массив)
        coins: [
            { x: 5 * tileSize, y: 3 * tileSize, w: 16, h: 16, active: true, value: 10 },
            { x: 10 * tileSize, y: 5 * tileSize, w: 16, h: 16, active: true, value: 10 },
            { x: 3 * tileSize, y: 8 * tileSize, w: 16, h: 16, active: true, value: 10 },
            { x: 12 * tileSize, y: 10 * tileSize, w: 16, h: 16, active: true, value: 10 },
            { x: 7 * tileSize, y: 12 * tileSize, w: 16, h: 16, active: true, value: 10 }
        ],
        // Финишный портал (переход на следующий уровень)
        portal: {
            x: (cols - 2) * tileSize,
            y: (rows - 2) * tileSize,
            w: 40, h: 40,
            active: true
        }
    };
};

// Движущиеся машины
export const cars = [
    { x: 100, y: 200, w: 50, h: 30, speed: 2, direction: 1, active: true },
    { x: 500, y: 400, w: 50, h: 30, speed: -2, direction: -1, active: true }
];

export function updateCars(carsArray, mapWidth) {
    for (let car of carsArray) {
        car.x += car.speed;
        // зацикливание
        if (car.x > mapWidth + 50) car.x = -50;
        if (car.x < -50) car.x = mapWidth + 50;
    }
}

export function checkCarCollision(mouse, carsArray) {
    for (let car of carsArray) {
        if (car.active &&
            mouse.x < car.x + car.w && mouse.x + mouse.w > car.x &&
            mouse.y < car.y + car.h && mouse.y + mouse.h > car.y) {
            return true;  // столкновение с машиной
        }
    }
    return false;
}