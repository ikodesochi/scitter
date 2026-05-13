// levels/level_friendship.js
// Уровень 4: Дружба — круглая арена, вода в центре, трубы по кругу
// Коты наступают со всех сторон, собака защищает

export const levelInfo = {
    id: 4,
    name: "Дружба",
    cheeseGoal: 10,
    boneGoal: 8,
    catSpeed: 2.0,
    catAggression: 1,
    dogEnabled: true,
    multiCat: true,
    catCount: 5,
    spawnPipes: true,
    visionRange: 9999
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
    
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    const radius = 12;
    
    // Заполняем всё вне круга стенами
    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols - 1; j++) {
            const dist = Math.sqrt((i - cy) ** 2 + (j - cx) ** 2);
            if (dist > radius) {
                map[i][j] = 1;
            }
        }
    }
    
    // Вода в центре
    const waterRadius = 3;
    for (let i = cy - waterRadius; i <= cy + waterRadius; i++) {
        for (let j = cx - waterRadius; j <= cx + waterRadius; j++) {
            const dist = Math.sqrt((i - cy) ** 2 + (j - cx) ** 2);
            if (dist <= waterRadius) {
                map[i][j] = 3;
            }
        }
    }
    
    // Трубы по краям круга
    const pipeAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    for (const angle of pipeAngles) {
        const rad = angle * Math.PI / 180;
        const px = Math.floor(cx + (radius - 1) * Math.cos(rad));
        const py = Math.floor(cy + (radius - 1) * Math.sin(rad));
        if (px > 1 && px < cols - 2 && py > 1 && py < rows - 2) {
            map[py][px] = 5;
            map[py][px + 1] = 5;
            map[py + 1][px] = 5;
            map[py + 1][px + 1] = 5;
        }
    }
    
    // Ящики внутри арены
    for (let i = cy - radius + 2; i < cy + radius - 1; i++) {
        for (let j = cx - radius + 2; j < cx + radius - 1; j++) {
            const dist = Math.sqrt((i - cy) ** 2 + (j - cx) ** 2);
            if (dist > waterRadius + 1 && dist < radius - 2 && map[i][j] === 0 && Math.random() < 0.12) {
                map[i][j] = 5;
            }
        }
    }
    
    return map;
}

export function getItemPositions(tileSize, rows, cols) {
    const cheeses = [];
    const bones = [];
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    const waterRadius = 3;
    const arenaRadius = 10;
    
    // Сыр вдоль стен круга
    for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        const r = 8;
        cheeses.push({
            x: (cx + Math.cos(angle) * r) * tileSize + 10,
            y: (cy + Math.sin(angle) * r) * tileSize + 10
        });
    }
    
    // Кости вокруг воды
    for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const r = 5;
        bones.push({
            x: (cx + Math.cos(angle) * r) * tileSize + 10,
            y: (cy + Math.sin(angle) * r) * tileSize + 10
        });
    }
    
    // Лунка — случайное место внутри арены, не в воде, не у стены
    let holeX, holeY;
    let attempts = 0;
    do {
        const angle = Math.random() * Math.PI * 2;
        const distance = 4 + Math.random() * (arenaRadius - 5); // Между водой и стеной
        holeX = cx + Math.cos(angle) * distance;
        holeY = cy + Math.sin(angle) * distance;
        attempts++;
    } while (attempts < 50 && 
             Math.sqrt((holeX - cx) ** 2 + (holeY - cy) ** 2) <= waterRadius + 1);
    
    return {
        cheeses,
        bones,
        hole: { 
            x: holeX * tileSize - tileSize/2, 
            y: holeY * tileSize - tileSize/2 
        }
    };
}

export function getStartPositions(tileSize, rows, cols) {
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    
    return {
        // Мышь у края круга
        mouse: { x: (cx - 8) * tileSize + 5, y: cy * tileSize + 5 },
        // Основной кот напротив
        cat: { x: (cx + 8) * tileSize, y: cy * tileSize },
        // Дополнительные коты по краям
        extraCats: [
            { x: cx * tileSize, y: (cy - 9) * tileSize },
            { x: (cx + 6) * tileSize, y: (cy + 6) * tileSize },
            { x: (cx - 6) * tileSize, y: (cy + 6) * tileSize },
            { x: (cx + 9) * tileSize, y: (cy - 3) * tileSize }
        ],
        // Собака у воды в центре
        dog: { x: cx * tileSize + 5, y: (cy + 4) * tileSize + 5 }
    };
}