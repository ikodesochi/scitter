// systems/levelManager.js
// Главный менеджер уровней — переключает уровни, создаёт карту и персонажей

import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../core/constants.js';
import { Mouse } from '../entities/mouse.js';
import { Cat } from '../entities/cat.js';
import { Dog } from '../entities/dog.js';
import { Cockroach } from '../entities/cockroach.js';
import { quests as questList } from '../quests/questList.js';
import { setQuests, checkQuests, resetQuests } from '../quests/questManager.js';
import { addItem, resetInventory } from '../inventory/inventory.js';
import { updateAchievements } from '../systems/achievements.js';
import { resetOilSlicks, resetSpikes, resetPlatforms } from '../traps/resetTraps.js';
import { playCheese } from './audio.js';
import { buildShopMap, createShopEntities } from './shopLevel.js';

import { buildMap as b1, getItemPositions as i1, getStartPositions as s1 } from '../levels/level_meeting.js';
import { buildMap as b2, getItemPositions as i2, getStartPositions as s2 } from '../levels/level_darkness.js';
import { buildMap as b3, getItemPositions as i3, getStartPositions as s3 } from '../levels/level_street.js';
import { buildMap as b4, getItemPositions as i4, getStartPositions as s4 } from '../levels/level_friendship.js';
import { buildMap as b5, getItemPositions as i5, getStartPositions as s5 } from '../levels/level_traps.js';
import { buildMap as b6, getItemPositions as i6, getStartPositions as s6 } from '../levels/level_final.js';

const levels = [
    { info: { id: 1, name: "Подземелье", cheeseGoal: 8, boneGoal: 0, catSpeed: 1.5, catAggression: 0, dogEnabled: false }, build: b1, items: i1, start: s1 },
    { info: { id: 2, name: "Темнота", cheeseGoal: 8, boneGoal: 0, catSpeed: 2.0, catAggression: 1, darknessEnabled: true, visionRadius: 80, dogEnabled: false }, build: b2, items: i2, start: s2 },
    { info: { id: 3, name: "Улица", cheeseGoal: 10, boneGoal: 0, catSpeed: 2.0, catAggression: 1, dogEnabled: false }, build: b3, items: i3, start: s3 },
    { info: { id: 4, name: "Дружба", cheeseGoal: 10, boneGoal: 8, catSpeed: 2.0, catAggression: 1, dogEnabled: true, multiCat: true, catCount: 5, spawnPipes: true, visionRange: 9999 }, build: b4, items: i4, start: s4 },
    { info: { id: 5, name: "Ловушки", cheeseGoal: 12, boneGoal: 0, catSpeed: 2.8, catAggression: 2, trapsEnabled: true, dogEnabled: false }, build: b5, items: i5, start: s5 },
    { info: { id: 6, name: "Финал", cheeseGoal: 5, boneGoal: 0, catSpeed: 3.5, catAggression: 3, darknessEnabled: true, visionRadius: 100, bossEnabled: true, bossPhases: 3, dogEnabled: false }, build: b6, items: i6, start: s6 }
];

let worldMap, mouse, cat, dog, cockroach;
let extraCats = [];
let cheeses = [], bones = [], hole = null;
let holeActive = false, gameActive = true;
let cheeseCount = 0, boneCount = 0;
let currentLevel = 0, inShop = false;
let pipeSpawnTimer = 0;

function free(r, c) { return worldMap && worldMap[r] && worldMap[r][c] === 0; }

function areaFree(r, c, w, h) {
    for (let y = r; y < r + h; y++)
        for (let x = c; x < c + w; x++)
            if (!free(y, x)) return false;
    return true;
}

function findPos(px, py, w, h) {
    const C = worldMap[0].length, R = worldMap.length;
    const ok = (x, y) => {
        const l = Math.floor(x / TILE_SIZE), r = Math.floor((x + w - 1) / TILE_SIZE);
        const t = Math.floor(y / TILE_SIZE), b = Math.floor((y + h - 1) / TILE_SIZE);
        return l >= 0 && r < C && t >= 0 && b < R && areaFree(t, l, r - l + 1, b - t + 1);
    };
    if (ok(px, py)) return { x: px, y: py };
    const sc = Math.floor(px / TILE_SIZE), sr = Math.floor(py / TILE_SIZE);
    for (let rad = 1; rad < Math.max(C, R); rad++)
        for (let dr = -rad; dr <= rad; dr++)
            for (let dc = -rad; dc <= rad; dc++) {
                if (Math.abs(dr) !== rad && Math.abs(dc) !== rad) continue;
                const x = (sc + dc) * TILE_SIZE + (TILE_SIZE - w) / 2;
                const y = (sr + dr) * TILE_SIZE + (TILE_SIZE - h) / 2;
                if (ok(x, y)) return { x, y };
            }
    return { x: Math.floor(C / 2) * TILE_SIZE, y: Math.floor(R / 2) * TILE_SIZE };
}

function genItems(n, iw, ih) {
    const arr = [], C = worldMap[0].length, R = worldMap.length;
    for (let a = 0; a < n * 100 && arr.length < n; a++) {
        const c = Math.floor(Math.random() * (C - 2)) + 1;
        const r = Math.floor(Math.random() * (R - 2)) + 1;
        if (areaFree(r, c, Math.ceil(iw / TILE_SIZE), Math.ceil(ih / TILE_SIZE))) {
            const nx = c * TILE_SIZE + Math.random() * (TILE_SIZE - iw);
            const ny = r * TILE_SIZE + Math.random() * (TILE_SIZE - ih);
            if (!arr.some(p => Math.hypot(p.x - nx, p.y - ny) < TILE_SIZE * 3))
                arr.push({ x: nx, y: ny });
        }
    }
    return arr;
}

function genHole() {
    const C = worldMap[0].length, R = worldMap.length;
    for (let a = 0; a < 100; a++) {
        const c = Math.floor(Math.random() * (C - 4)) + 2, r = R - 3;
        if (areaFree(r, c, 1, 1)) return { x: c * TILE_SIZE, y: r * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE };
    }
    return { x: (C - 2) * TILE_SIZE - 10, y: (R - 2) * TILE_SIZE - 10, w: TILE_SIZE, h: TILE_SIZE };
}

export function initLevel() {
    const C = Math.floor(WORLD_WIDTH / TILE_SIZE), R = Math.floor(WORLD_HEIGHT / TILE_SIZE);
    
    if (inShop) {
        worldMap = buildShopMap(R, C);
        const e = createShopEntities(C, R);
        mouse = new Mouse(e.mousePos.x, e.mousePos.y, 28, 28, 4);
        cockroach = new Cockroach(e.cockroachPos.x, e.cockroachPos.y, 32, 32, 0);
        cat = dog = null;
        extraCats = [];
        cheeses = []; bones = [];
        hole = { ...e.holePos }; holeActive = true;
        cheeseCount = boneCount = 0;
    } else {
        const lvl = levels[currentLevel];
        worldMap = lvl.build(R, C);
        const sp = lvl.start(TILE_SIZE, R, C);
        const mp = findPos(sp.mouse.x, sp.mouse.y, 28, 28);
        const cp = findPos(sp.cat.x, sp.cat.y, 32, 32);
        
        mouse = new Mouse(mp.x, mp.y, 28, 28, 4);
        mouse.onLevelStart();
        
        cat = new Cat(cp.x, cp.y, 32, 32, lvl.info.catSpeed);
        if (lvl.info.visionRange) cat.visionRange = lvl.info.visionRange;
        
        extraCats = [];
        if (lvl.info.multiCat && sp.extraCats) {
            for (const ec of sp.extraCats) {
                const ecp = findPos(ec.x, ec.y, 32, 32);
                const newCat = new Cat(ecp.x, ecp.y, 32, 32, lvl.info.catSpeed);
                if (lvl.info.visionRange) newCat.visionRange = lvl.info.visionRange;
                extraCats.push(newCat);
            }
        }
        
        dog = lvl.info.dogEnabled ? new Dog(findPos(sp.dog.x, sp.dog.y, 32, 32).x, findPos(sp.dog.x, sp.dog.y, 32, 32).y, 32, 32, 1.5) : null;
        cockroach = null;
        
        cheeses = genItems(lvl.info.cheeseGoal, 20, 20).map(p => ({ ...p, w: 20, h: 20, collected: false }));
        bones = genItems(lvl.info.boneGoal, 16, 16).map(p => ({ ...p, w: 16, h: 16, collected: false }));
        
        // Лунка из данных уровня если есть, иначе случайная
        const itemsData = lvl.items(TILE_SIZE, R, C);
        if (itemsData && itemsData.hole) {
            hole = { x: itemsData.hole.x, y: itemsData.hole.y, w: TILE_SIZE, h: TILE_SIZE };
        } else {
            hole = genHole();
        }
        holeActive = false;
        cheeseCount = boneCount = 0;
    }
    
    pipeSpawnTimer = 0;
    resetInventory();
    resetQuests();
    setQuests(questList.map(q => ({ ...q, completed: false })));
    resetOilSlicks(); resetSpikes(); resetPlatforms();
    gameActive = true;
}

export function updatePipeSpawns() {
    const lvl = levels[currentLevel];
    if (!lvl.info.spawnPipes) return;
    
    pipeSpawnTimer++;
    if (pipeSpawnTimer >= 300) {
        pipeSpawnTimer = 0;
        
        if (extraCats.length < 8) {
            const C = Math.floor(WORLD_WIDTH / TILE_SIZE);
            const R = Math.floor(WORLD_HEIGHT / TILE_SIZE);
            const cx = Math.floor(C / 2);
            const cy = Math.floor(R / 2);
            
            // Спавн внутри арены (радиус 10 тайлов), не в воде (радиус 3)
            let spawnX, spawnY;
            let attempts = 0;
            do {
                const angle = Math.random() * Math.PI * 2;
                const distance = 4 + Math.random() * 8; // Между водой и стеной
                spawnX = (cx + Math.cos(angle) * distance) * TILE_SIZE;
                spawnY = (cy + Math.sin(angle) * distance) * TILE_SIZE;
                attempts++;
            } while (attempts < 50 && !areaFree(
                Math.floor(spawnY / TILE_SIZE), 
                Math.floor(spawnX / TILE_SIZE), 
                1, 1
            ));
            
            const newCat = new Cat(spawnX, spawnY, 32, 32, lvl.info.catSpeed);
            if (lvl.info.visionRange) newCat.visionRange = lvl.info.visionRange;
            extraCats.push(newCat);
        }
    }
}

export const getWorldMap = () => worldMap;
export const getMouse = () => mouse;
export const getCat = () => cat;
export const getDog = () => dog;
export const getExtraCats = () => extraCats;
export const getCockroach = () => cockroach;
export const getCheeses = () => cheeses;
export const getBones = () => bones;
export const getHole = () => hole && holeActive ? { ...hole, active: true } : null;
export const isGameActive = () => gameActive;
export const setGameActive = v => { gameActive = v; };
export const getCheeseCount = () => cheeseCount;
export const getBoneCount = () => boneCount;
export const getTotalCheeseGoal = () => inShop ? 0 : levels[currentLevel].info.cheeseGoal;
export const getTotalBoneGoal = () => inShop ? 0 : levels[currentLevel].info.boneGoal;
export const getCheeseCollectedForCat = () => cheeseCount;
export const getCurrentLevelInfo = () => inShop ? { id: 0, name: "Вентиляция", dogEnabled: false } : levels[currentLevel].info;
export const isInShop = () => inShop;

export function collectCheese(i) {
    if (!cheeses[i] || cheeses[i].collected) return;
    cheeses[i].collected = true;
    cheeseCount++;
    addItem('cheese');
    updateAchievements({ type: 'cheese', value: 1 });
    checkQuests();
    mouse?.onCollectCheese();
    playCheese();
    if (!inShop && cheeseCount >= levels[currentLevel].info.cheeseGoal && !holeActive) {
        holeActive = true;
        mouse?.showStatus("!!!", 2);
    }
}

export function collectBone(i) {
    if (!bones[i] || bones[i].collected) return;
    bones[i].collected = true;
    boneCount++;
    if (dog) { dog.fullness = Math.min(100, dog.fullness + 20); dog.onFed(); }
    mouse?.onCollectBone();
    mouse?.onFeedDog();
    addItem('bone');
    updateAchievements({ type: 'bone', value: 1 });
    checkQuests();
    if (!inShop && cheeseCount >= levels[currentLevel].info.cheeseGoal && !holeActive) {
        holeActive = true;
        mouse?.showStatus("!!!", 2);
    }
}

export const enterShop = () => { inShop = true; initLevel(); };
export const exitShop = () => { inShop = false; currentLevel = Math.min(currentLevel + 1, levels.length - 1); initLevel(); };
export const nextLevel = () => { inShop ? exitShop() : enterShop(); };
export const restartCurrentLevel = () => { inShop = false; initLevel(); };
export const resetLevel = () => { currentLevel = 0; inShop = false; mouse?.resetUpgrades(); initLevel(); };
export const goToLevel = (i) => { currentLevel = Math.min(i, levels.length - 1); inShop = false; initLevel(); };

export function toggleHole() {
    holeActive = !holeActive;
    if (!hole) {
        const C = Math.floor(WORLD_WIDTH / TILE_SIZE), R = Math.floor(WORLD_HEIGHT / TILE_SIZE);
        hole = { x: Math.floor(C/2) * TILE_SIZE - TILE_SIZE/2, y: Math.floor(R/2) * TILE_SIZE - TILE_SIZE/2, w: TILE_SIZE, h: TILE_SIZE };
    }
    if (holeActive) mouse?.showStatus("!!!", 2);
}

export const setCheeseBoost = (on) => { cheeseCount = Math.max(0, Math.min(999, cheeseCount + (on ? 100 : -100))); };
export const setBoneBoost = (on) => { boneCount = Math.max(0, Math.min(999, boneCount + (on ? 100 : -100))); };