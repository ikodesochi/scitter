// game.js
// Главный файл игры — запускает всё и управляет игровым циклом

import { W, H, TILE_SIZE } from './core/constants.js';
import { initInput, processInput } from './systems/input.js';
import { 
    initLevel, getMouse, getCat, getDog, getExtraCats, getCockroach,
    isGameActive, resetLevel,
    getCurrentLevelInfo, isInShop,
    getCheeseCount, enterShop, getWorldMap,
    goToLevel, toggleHole, setCheeseBoost, setBoneBoost,
    updatePipeSpawns
} from './systems/levelManager.js';
import { updateGame, setTryMove } from './systems/gameManager.js';
import { updateCamera } from './world/camera.js';
import { render } from './systems/renderer.js';
import { loadSounds } from './systems/audio.js';
import { initAchievements } from './systems/achievements.js';
import { initMenu } from './ui/menu.js';
import { openShop, isShopOpen, initShopInput } from './systems/shop.js';
import { initAdmin, isNoclip, isGodmode, isSpeedBoost, isShowInfo } from './systems/admin.js';
import { showSplash } from './ui/splash.js';
import { showLevelIntro } from './ui/levelIntro.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

let lastLevel = -1;

async function initGame() {
    await loadSounds();
    initAchievements();
    initInput();
    initShopInput();
    initAdmin();
    initLevel();
    initMenu();
    setTryMove(processInput.tryMove);
    
    window._skipToLevel = (i) => {
        goToLevel(i);
        showLevelIntro(i, () => { lastLevel = i; });
    };
    window._enterShop = () => enterShop();
    window._toggleHole = () => toggleHole();
    window._setCheeseBoost = (on) => setCheeseBoost(on);
    window._setBoneBoost = (on) => setBoneBoost(on);
    
    showLevelIntro(0, () => {
        lastLevel = 0;
        update();
    });
}

function update() {
    if (isGameActive() && !isShopOpen()) {
        const mouse = getMouse();
        const cat = getCat();
        const dog = getDog();
        const extraCats = getExtraCats();
        const cockroach = getCockroach();
        
        const levelInfo = getCurrentLevelInfo();
        if (levelInfo && levelInfo.id > 0 && levelInfo.id - 1 !== lastLevel) {
            lastLevel = levelInfo.id - 1;
            showLevelIntro(lastLevel, () => {});
        }
        
        if (mouse) {
            // NOCLIP
            if (isNoclip()) {
                if (!processInput._origTryMove) processInput._origTryMove = processInput.tryMove;
                processInput.tryMove = (obj, dx, dy) => { obj.x += dx; obj.y += dy; return true; };
            } else {
                if (processInput._origTryMove) {
                    processInput.tryMove = processInput._origTryMove;
                    processInput._origTryMove = null;
                }
            }
            
            // SPEED
            if (isSpeedBoost()) {
                if (!mouse._origSpeed) mouse._origSpeed = mouse.speed;
                mouse.speed = 10;
            } else {
                if (mouse._origSpeed) {
                    mouse.speed = mouse._origSpeed;
                    mouse._origSpeed = null;
                }
            }
            
            // GOD
            if (isGodmode()) {
                mouse.health = 999;
                mouse.invincible = true;
            }
            
            processInput(mouse);
            
            // Таракан
            if (cockroach && isInShop()) {
                cockroach.update(mouse, processInput.tryMove);
                if (Math.hypot(mouse.x - cockroach.x, mouse.y - cockroach.y) < 60) {
                    window._openShop = () => openShop(cockroach, mouse, getCheeseCount(), () => {});
                }
            }
            
            // Коты
            if (cat && !isGodmode()) cat.update(mouse, processInput.tryMove, getCurrentLevelInfo());
            if (extraCats && !isGodmode()) {
                for (const ec of extraCats) ec.update(mouse, processInput.tryMove, getCurrentLevelInfo());
            }
            
            // Собака
            if (dog) dog.update(mouse, processInput.tryMove, cat);
            
            updateGame();
            updatePipeSpawns();
            updateCamera(mouse.x, mouse.y);
        }
    }
    
    render(ctx);
    if (isShowInfo()) drawAdminInfo(ctx);
    requestAnimationFrame(update);
}

function drawAdminInfo(ctx) {
    const mouse = getMouse();
    const worldMap = getWorldMap();
    if (!mouse || !worldMap) return;
    
    const tx = Math.floor(mouse.x / TILE_SIZE);
    const ty = Math.floor(mouse.y / TILE_SIZE);
    const tile = worldMap[ty]?.[tx] ?? '?';
    
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(10, 40, 200, 80);
    ctx.fillStyle = "#0f0";
    ctx.font = "10px monospace";
    ctx.fillText(`POS: ${Math.floor(mouse.x)}, ${Math.floor(mouse.y)}`, 16, 55);
    ctx.fillText(`TILE: ${tx}, ${ty} = ${tile}`, 16, 68);
    ctx.fillText(`SPD: ${mouse.speed.toFixed(1)} | HP: ${mouse.health}`, 16, 81);
    ctx.fillText(`NOCLIP: ${isNoclip()} | GOD: ${isGodmode()}`, 16, 94);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' && isInShop() && window._openShop) {
        window._openShop();
        e.preventDefault();
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.onload = () => {
    showSplash(initGame);
};