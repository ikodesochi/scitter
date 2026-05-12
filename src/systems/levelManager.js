// systems/levelManager.js
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../core/constants.js';
import { generateWorld, TILE_EMPTY } from '../world/worldGenerator.js';
import { Mouse } from '../entities/Mouse.js';
import { Cat } from '../entities/Cat.js';
import { Dog } from '../entities/Dog.js';

let worldMap = null;
let mouse = null;
let cat = null;
let dog = null;
let cheeses = [];
let bones = [];
let hole = null;
let gameActive = true;
let cheeseCount = 0;
let boneCount = 0;

export function initLevel() {
    worldMap = generateWorld();
    mouse = new Mouse(200, 200, 28, 28, 4);
    cat = new Cat(1500, 1500, 32, 32, 2.5);
    dog = new Dog(1000, 1000, 32, 32, 1.5);
    cheeseCount = 0;
    boneCount = 0;
    generateCheeses(15);
    generateBones(8);
    generateHole();
    gameActive = true;
}

function generateCheeses(count = 15) {
    cheeses = [];
    for (let i = 0; i < count; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 150) {
            const x = Math.random() * (WORLD_WIDTH - 30);
            const y = Math.random() * (WORLD_HEIGHT - 30);
            const col = Math.floor(x / TILE_SIZE);
            const row = Math.floor(y / TILE_SIZE);
            if (worldMap[row] && worldMap[row][col] === TILE_EMPTY) {
                cheeses.push({ x, y, w: 20, h: 20, collected: false });
                placed = true;
            }
            attempts++;
        }
    }
}

function generateBones(count = 8) {
    bones = [];
    for (let i = 0; i < count; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 150) {
            const x = Math.random() * (WORLD_WIDTH - 20);
            const y = Math.random() * (WORLD_HEIGHT - 20);
            const col = Math.floor(x / TILE_SIZE);
            const row = Math.floor(y / TILE_SIZE);
            if (worldMap[row] && worldMap[row][col] === TILE_EMPTY) {
                bones.push({ x, y, w: 16, h: 16, collected: false });
                placed = true;
            }
            attempts++;
        }
    }
}

function generateHole() {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 150) {
        const x = Math.random() * (WORLD_WIDTH - TILE_SIZE);
        const y = Math.random() * (WORLD_HEIGHT - TILE_SIZE);
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        if (worldMap[row] && worldMap[row][col] === TILE_EMPTY) {
            hole = { x, y, w: TILE_SIZE, h: TILE_SIZE, active: false };
            placed = true;
        }
        attempts++;
    }
}

export function getWorldMap() { return worldMap; }
export function getMouse() { return mouse; }
export function getCat() { return cat; }
export function getDog() { return dog; }
export function getCheeses() { return cheeses; }
export function getBones() { return bones; }
export function getHole() { return hole; }
export function isGameActive() { return gameActive; }
export function setGameActive(value) { gameActive = value; }
export function getCheeseCount() { return cheeseCount; }
export function getBoneCount() { return boneCount; }
export function getTotalCheeseGoal() { return cheeses.length; }
export function getTotalBoneGoal() { return bones.length; }
export function getCheeseCollectedForCat() { return cheeseCount; }

export function collectCheese(index) {
    if (cheeses[index] && !cheeses[index].collected) {
        cheeses[index].collected = true;
        cheeseCount++;
        checkAllCollected();
    }
}

export function collectBone(index) {
    if (bones[index] && !bones[index].collected) {
        bones[index].collected = true;
        boneCount++;
        if (dog) dog.fullness = Math.min(100, dog.fullness + 20);
        checkAllCollected();
    }
}

function checkAllCollected() {
    const allCheese = cheeses.length > 0 && cheeses.every(c => c.collected);
    const allBones = bones.length > 0 && bones.every(b => b.collected);
    if (allCheese && allBones && hole) {
        hole.active = true;
        console.log("Лунка активирована!");
    }
}

export function resetLevel() {
    initLevel();
}