// game.js
import { W, H, TILE_SIZE } from './core/constants.js';
import { initInput, keys } from './systems/input.js';
import { 
    initLevel, 
    getWorldMap, 
    getMouse, 
    getCat, 
    getDog, 
    getCheeses,
    getBones,
    getHole,
    getCheeseCount,
    getBoneCount,
    getTotalCheeseGoal,
    getTotalBoneGoal,
    getCheeseCollectedForCat,
    isGameActive,
    setGameActive,
    resetLevel
} from './systems/levelManager.js';
import { updateGame } from './systems/gameManager.js';
import { updateCamera, getCamera } from './world/camera.js';
import { drawWorld } from './world/worldRenderer.js';
import { loadSounds } from './systems/audio.js';
import { initAchievements } from './systems/achievements.js';
import { initMenu } from './ui/menu.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = W;
canvas.height = H;

function isSolid(x, y, w, h) {
    const left = Math.floor(x / TILE_SIZE);
    const right = Math.floor((x + w - 1) / TILE_SIZE);
    const top = Math.floor(y / TILE_SIZE);
    const bottom = Math.floor((y + h - 1) / TILE_SIZE);
    const worldMap = getWorldMap();
    if (!worldMap) return true;
    if (left < 0 || right >= worldMap[0].length || top < 0 || bottom >= worldMap.length) return true;
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            const tile = worldMap[i][j];
            if (tile === 1 || tile === 2 || tile === 4 || tile === 5) return true;
        }
    }
    return false;
}

function tryMove(obj, dx, dy) {
    const newX = obj.x + dx;
    const newY = obj.y + dy;
    if (!isSolid(newX, obj.y, obj.w, obj.h)) obj.x = newX;
    if (!isSolid(obj.x, newY, obj.w, obj.h)) obj.y = newY;
}

function resetGameCallback() {
    resetLevel();
    setGameActive(true);
}

async function initGame() {
    await loadSounds();
    initAchievements();
    initInput();
    initLevel();
    initMenu(resetGameCallback);
    update();
}

function update() {
    if (!isGameActive()) return;
    
    const mouse = getMouse();
    const cat = getCat();
    const dog = getDog();
    
    if (!mouse || !cat || !dog) return;
    
    let dx = 0, dy = 0;
    if (keys.ArrowLeft) dx = -mouse.speed;
    if (keys.ArrowRight) dx = mouse.speed;
    if (keys.ArrowUp) dy = -mouse.speed;
    if (keys.ArrowDown) dy = mouse.speed;
    if (dx !== 0 || dy !== 0) tryMove(mouse, dx, dy);
    
    const cheeseForCat = getCheeseCollectedForCat();
    cat.update(mouse, tryMove, cheeseForCat);
    
    const dogDx = mouse.x - dog.x;
    const dogDy = mouse.y - dog.y;
    const dogDist = Math.hypot(dogDx, dogDy);
    if (dogDist > 100) {
        const step = Math.min(dog.speed, dogDist);
        tryMove(dog, (dogDx / dogDist) * step, (dogDy / dogDist) * step);
    }
    
    updateGame(tryMove);
    updateCamera(mouse.x, mouse.y);
    draw();
    requestAnimationFrame(update);
}

function draw() {
    const worldMap = getWorldMap();
    if (!worldMap) return;
    
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);
    
    const camera = getCamera();
    drawWorld(ctx, camera, worldMap);
    
    const cheeses = getCheeses();
    if (cheeses) {
        for (let cheese of cheeses) {
            if (!cheese.collected) {
                const x = cheese.x - camera.x;
                const y = cheese.y - camera.y;
                ctx.fillStyle = "#ccaa44";
                ctx.fillRect(x, y, cheese.w, cheese.h);
            }
        }
    }
    
    const bones = getBones();
    if (bones) {
        for (let bone of bones) {
            if (!bone.collected) {
                const x = bone.x - camera.x;
                const y = bone.y - camera.y;
                ctx.fillStyle = "#ddbb88";
                ctx.fillRect(x, y, bone.w, bone.h);
            }
        }
    }
    
    const hole = getHole();
    if (hole && hole.active) {
        const x = hole.x - camera.x;
        const y = hole.y - camera.y;
        ctx.fillStyle = "#444";
        ctx.fillRect(x, y, hole.w, hole.h);
        ctx.fillStyle = "#222";
        ctx.fillRect(x + 10, y + 10, hole.w - 20, hole.h - 20);
    }
    
    const mouse = getMouse();
    const cat = getCat();
    const dog = getDog();
    
    if (mouse) {
        const cheeseCount = getCheeseCount();
        const boneCount = getBoneCount();
        const totalCheese = getTotalCheeseGoal();
        const totalBone = getTotalBoneGoal();
        mouse.draw(ctx, camera, cheeseCount, boneCount, totalCheese, totalBone);
    }
    if (cat) cat.draw(ctx, camera);
    if (dog) dog.draw(ctx, camera, getBoneCount());
}

window.onload = initGame;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});