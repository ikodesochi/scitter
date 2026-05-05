const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelSpan = document.getElementById('levelValue');

const W = 800, H = 600;
canvas.width = W;
canvas.height = H;

let gameActive = true;
let gameOver = false;
let currentLevel = 1;
let inSewer = false;

const TILE_SIZE = 40;
const COLS = W / TILE_SIZE;
const ROWS = H / TILE_SIZE;

function generateRandomMap() {
    let map = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    for (let i = 0; i < ROWS; i++) map[i][0] = 1;
    for (let i = 0; i < ROWS; i++) map[i][COLS-1] = 1;
    for (let j = 0; j < COLS; j++) map[0][j] = 1;
    for (let j = 0; j < COLS; j++) map[ROWS-1][j] = 1;
    for (let i = 2; i < ROWS-2; i++) {
        for (let j = 2; j < COLS-2; j++) {
            if (Math.random() < 0.2 && !(i === 2 && j === 2)) {
                map[i][j] = 1;
            }
        }
    }
    return map;
}

function getRandomFreeSpot(map) {
    let free = [];
    for (let i = 1; i < ROWS-1; i++) {
        for (let j = 1; j < COLS-1; j++) {
            if (map[i][j] === 0) free.push({ x: j * TILE_SIZE, y: i * TILE_SIZE });
        }
    }
    if (free.length === 0) return { x: 60, y: 60 };
    let r = Math.floor(Math.random() * free.length);
    return free[r];
}

let levelMaps = [];
for (let i = 0; i < 5; i++) levelMaps.push(null);

let currentMap = [];
let mouse = { x: 60, y: 60, w: 28, h: 28 };
let cat = { x: 700, y: 500, w: 32, h: 32 };
let hole = { x: 650, y: 80, w: 40, h: 40 };

function initLevel() {
    let map = generateRandomMap();
    levelMaps[currentLevel-1] = map;
    currentMap = map.map(row => [...row]);

    let mousePos = getRandomFreeSpot(currentMap);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;

    let catPos = getRandomFreeSpot(currentMap);
    cat.x = catPos.x;
    cat.y = catPos.y;

    let holePos = getRandomFreeSpot(currentMap);
    hole.x = holePos.x;
    hole.y = holePos.y;
}

// Прямая дорожка в вентиляции
const sewerMap = Array(ROWS).fill().map(() => Array(COLS).fill(1));
for (let i = 0; i < ROWS; i++) sewerMap[i][0] = 1;
for (let i = 0; i < ROWS; i++) sewerMap[i][COLS-1] = 1;
for (let j = 0; j < COLS; j++) sewerMap[0][j] = 1;
for (let j = 0; j < COLS; j++) sewerMap[ROWS-1][j] = 1;
for (let i = 1; i < ROWS-1; i++) {
    let mid = Math.floor(COLS / 2);
    sewerMap[i][mid] = 0;
}

let cheese = { x: (Math.floor(COLS / 2)) * TILE_SIZE + 8, y: (ROWS-2) * TILE_SIZE + 8, w: 25, h: 25, active: true };

initLevel();

function isSolid(x, y, w, h, map) {
    let left = Math.floor(x / TILE_SIZE);
    let right = Math.floor((x + w - 1) / TILE_SIZE);
    let top = Math.floor(y / TILE_SIZE);
    let bottom = Math.floor((y + h - 1) / TILE_SIZE);
    left = Math.max(0, left);
    right = Math.min(COLS-1, right);
    top = Math.max(0, top);
    bottom = Math.min(ROWS-1, bottom);
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (map[i][j] === 1) return true;
        }
    }
    return false;
}

function tryMove(obj, dx, dy, map) {
    const newX = obj.x + dx;
    const newY = obj.y + dy;
    if (!isSolid(newX, obj.y, obj.w, obj.h, map)) obj.x = newX;
    if (!isSolid(obj.x, newY, obj.w, obj.h, map)) obj.y = newY;
}

const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
window.addEventListener('keydown', (e) => {
    if (!gameActive || gameOver) return;
    if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
});

function updateMouse() {
    let dx = 0, dy = 0;
    if (keys.ArrowLeft) dx = -4;
    if (keys.ArrowRight) dx = 4;
    if (keys.ArrowUp) dy = -4;
    if (keys.ArrowDown) dy = 4;
    tryMove(mouse, dx, dy, currentMap);
}

function updateCat() {
    if (inSewer) return;
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const len = Math.hypot(dx, dy);
    if (len > 0.5) {
        const step = Math.min(2.2, len);
        const moveX = (dx / len) * step;
        const moveY = (dy / len) * step;
        tryMove(cat, moveX, moveY, currentMap);
    }
}

function checkCatCollision() {
    if (inSewer) return;
    if (cat.x < mouse.x + mouse.w && cat.x + cat.w > mouse.x &&
        cat.y < mouse.y + mouse.h && cat.y + cat.h > mouse.y) {
        gameActive = false;
        gameOver = true;
    }
}

function checkHole() {
    if (!inSewer) {
        if (mouse.x < hole.x + hole.w && mouse.x + mouse.w > hole.x &&
            mouse.y < hole.y + hole.h && mouse.y + mouse.h > hole.y) {
            inSewer = true;
            currentMap = sewerMap;
            mouse.x = Math.floor(COLS / 2) * TILE_SIZE;
            mouse.y = TILE_SIZE;
            cheese.active = true;
        }
    } else {
        if (cheese.active &&
            mouse.x < cheese.x + cheese.w && mouse.x + mouse.w > cheese.x &&
            mouse.y < cheese.y + cheese.h && mouse.y + mouse.h > cheese.y) {
            inSewer = false;
            currentLevel++;
            if (currentLevel > 5) {
                alert("ПОБЕДА! Ты прошёл все уровни!");
                resetGame();
                return;
            }
            initLevel();
            levelSpan.innerText = currentLevel;
        }
    }
}

function resetGame() {
    gameActive = true;
    gameOver = false;
    inSewer = false;
    currentLevel = 1;
    for (let i = 0; i < 5; i++) levelMaps[i] = null;
    initLevel();
    levelSpan.innerText = currentLevel;
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (currentMap[i][j] === 1) {
                ctx.fillStyle = '#3a4a3a';
                ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = inSewer ? '#1a2a1a' : '#0a100a';
                ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    if (!inSewer) {
        ctx.fillStyle = '#2a6a2a';
        ctx.fillRect(cat.x, cat.y, cat.w, cat.h);
        ctx.font = '26px monospace';
        ctx.fillStyle = '#88ff88';
        ctx.fillText('🐱', cat.x + 6, cat.y + 28);
    }
    ctx.fillStyle = '#aa8866';
    ctx.fillRect(mouse.x, mouse.y, mouse.w, mouse.h);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🐭', mouse.x + 6, mouse.y + 22);
    if (!inSewer) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(hole.x, hole.y, hole.w, hole.h);
    }
    if (inSewer && cheese.active) {
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(cheese.x, cheese.y, cheese.w, cheese.h);
        ctx.fillStyle = '#ffaa22';
        ctx.fillRect(cheese.x + 5, cheese.y + 5, cheese.w - 10, cheese.h - 10);
    }
    if (gameOver) {
        ctx.fillStyle = '#ff8888';
        ctx.font = '30px monospace';
        ctx.fillText('GAME OVER', W/2 - 100, H/2);
    }
}

function update() {
    if (gameActive && !gameOver) {
        updateMouse();
        updateCat();
        checkCatCollision();
        checkHole();
    }
    draw();
    requestAnimationFrame(update);
}

document.getElementById('resetBtn').addEventListener('click', resetGame);
resetGame();
update();