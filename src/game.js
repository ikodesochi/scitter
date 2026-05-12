// game.js
import { Mouse } from './entities/mouse.js';
import { Cat } from './entities/cat.js';
import { Dog } from './entities/dog.js';
import { isSolid, tryMove } from './core/collision.js';
import { generateRandomMap, getRandomFreeSpot } from './core/mapGenerator.js';
import { sewerMap, sewerCheese } from './levels/sewer.js';
import { loadImage } from './core/assets.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelSpan = document.getElementById('levelValue');

const W = 800, H = 600;
const TILE_SIZE = 40;
const COLS = W / TILE_SIZE;
const ROWS = H / TILE_SIZE;

canvas.width = W;
canvas.height = H;

let gameActive = true;
let gameOver = false;
let currentLevel = 1;
let inSewer = false;

let currentMap = [];
let levelMaps = [null, null, null, null, null];
let cheese = null;

const mouse = new Mouse(60, 60, 28, 28, 4);
const cat = new Cat(700, 500, 32, 32, 2.2);
const dog = new Dog(400, 400, 32, 32, 0);

const keys = {
    ArrowUp: false, ArrowDown: false,
    ArrowLeft: false, ArrowRight: false
};

async function initGame() {
    const catImg = await loadImage("../assets/sprites/cat.png");
    const dogSleep = await loadImage("../assets/sprites/dog_sleep.png");
    const dogBark = await loadImage("../assets/sprites/dog_bark.png");
    cat.setImage(catImg);
    dog.setImages(dogSleep, dogBark);
    initLevel();
    update();
}

function initLevel() {
    const map = generateRandomMap(ROWS, COLS);
    levelMaps[currentLevel - 1] = map;
    currentMap = map.map(row => [...row]);

    const mousePos = getRandomFreeSpot(currentMap, ROWS, COLS, TILE_SIZE);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;

    const catPos = getRandomFreeSpot(currentMap, ROWS, COLS, TILE_SIZE);
    cat.x = catPos.x;
    cat.y = catPos.y;

    dog.x = mouse.x;
    dog.y = mouse.y - 50;
    dog.fullness = 100;
    dog.isProtecting = true;

    cheese = { x: 650, y: 80, w: 40, h: 40, active: true };
}

function updateMouse() {
    let dx = 0, dy = 0;
    if (keys.ArrowLeft) dx = -mouse.speed;
    if (keys.ArrowRight) dx = mouse.speed;
    if (keys.ArrowUp) dy = -mouse.speed;
    if (keys.ArrowDown) dy = mouse.speed;
    tryMove(mouse, dx, dy, currentMap, TILE_SIZE, currentMap);
}

function updateCat() {
    if (inSewer) return;
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.5) {
        const step = Math.min(cat.speed, dist);
        const moveX = (dx / dist) * step;
        const moveY = (dy / dist) * step;
        tryMove(cat, moveX, moveY, currentMap, TILE_SIZE, currentMap);
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

function updateDog() {
    dog.updateFullness();
}

function checkHole() {
    if (!inSewer) {
        if (mouse.x < cheese.x + cheese.w && mouse.x + mouse.w > cheese.x &&
            mouse.y < cheese.y + cheese.h && mouse.y + mouse.h > cheese.y) {
            inSewer = true;
            currentMap = sewerMap(ROWS, COLS);
            mouse.x = Math.floor(COLS / 2) * TILE_SIZE;
            mouse.y = TILE_SIZE;
            cheese = sewerCheese(COLS, ROWS, TILE_SIZE);
        }
    } else {
        if (cheese.active && mouse.x < cheese.x + cheese.w && mouse.x + mouse.w > cheese.x &&
            mouse.y < cheese.y + cheese.h && mouse.y + mouse.h > cheese.y) {
            inSewer = false;
            currentLevel++;
            if (currentLevel > 5) {
                alert("ПОБЕДА!");
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
        ctx.fillStyle = '#000000';
        ctx.fillRect(cheese.x, cheese.y, cheese.w, cheese.h);
    } else if (cheese.active) {
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(cheese.x, cheese.y, cheese.w, cheese.h);
    }

    dog.draw(ctx);
    cat.draw(ctx);
    mouse.draw(ctx);

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
        updateDog();
        checkCatCollision();
        checkHole();
    }
    draw();
    requestAnimationFrame(update);
}

window.addEventListener('keydown', (e) => {
    if (!gameActive || gameOver) return;
    if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
});

document.getElementById('resetBtn').addEventListener('click', resetGame);
initGame();