// systems/gameManager.js
// Игровая логика: сбор предметов, столкновения, кормление собаки

import { 
    getMouse, getCat, getDog, getExtraCats, getCheeses, getBones, getHole, 
    collectCheese, collectBone, isGameActive, setGameActive, 
    restartCurrentLevel, nextLevel, getCurrentLevelInfo, getBoneCount
} from './levelManager.js';
import { playCheese, playBark, playVictory, playGameOver } from './audio.js';
import { updateAchievements } from './achievements.js';

let feedCooldown = 0;

export function updateGame() {
    if (!isGameActive()) return;
    
    const mouse = getMouse();
    if (!mouse) return;
    
    const cat = getCat();
    const dog = getDog();
    const extraCats = getExtraCats();
    const levelInfo = getCurrentLevelInfo();
    
    // Сбор сыра
    const cheeses = getCheeses();
    if (cheeses) {
        for (let i = 0; i < cheeses.length; i++) {
            if (!cheeses[i].collected && isColliding(mouse, cheeses[i])) {
                collectCheese(i);
                playCheese();
            }
        }
    }
    
    // Сбор костей
    const bones = getBones();
    if (bones) {
        for (let i = 0; i < bones.length; i++) {
            if (!bones[i].collected && isColliding(mouse, bones[i])) {
                collectBone(i);
            }
        }
    }
    
    // Кормление собаки
    if (dog && feedCooldown > 0) feedCooldown--;
    if (dog) {
        const distToDog = Math.hypot(mouse.x - dog.x, mouse.y - dog.y);
        if (distToDog < 60 && feedCooldown <= 0 && getBoneCount() > 0) {
            feedDog();
            feedCooldown = 60;
        }
    }
    
    // Проверка лунки
    const hole = getHole();
    if (hole && hole.active && isColliding(mouse, hole)) {
        playVictory();
        nextLevel();
        return;
    }
    
    // Столкновение с основным котом — рестарт текущего уровня
    if (cat && isColliding(mouse, cat)) {
        setGameActive(false);
        playGameOver();
        setTimeout(() => { restartCurrentLevel(); setGameActive(true); }, 2000);
        return;
    }
    
    // Столкновение с дополнительными котами — рестарт текущего уровня
    if (extraCats) {
        for (const ec of extraCats) {
            if (isColliding(mouse, ec)) {
                setGameActive(false);
                playGameOver();
                setTimeout(() => { restartCurrentLevel(); setGameActive(true); }, 2000);
                return;
            }
        }
    }
    
    // Босс-механики
    if (levelInfo?.bossEnabled && cat) {
        const collected = getCheeses()?.filter(c => c.collected).length || 0;
        const phase = Math.floor(collected / (levelInfo.cheeseGoal / levelInfo.bossPhases));
        cat.speed = levelInfo.catSpeed + phase * 0.5;
        
        if (phase >= 2 && Math.random() < 0.02) {
            const dx = mouse.x - cat.x, dy = mouse.y - cat.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                const fn = window._tryMove || ((o, x, y) => { o.x += x; o.y += y; });
                fn(cat, (dx / dist) * 100, (dy / dist) * 100);
            }
        }
    }
    

    // Собака защищает — кот замирает на 3-5 секунд
    if (dog && dog.fullness > 0) {
        const allCats = [cat, ...(extraCats || [])].filter(c => c);
        for (const c of allCats) {
          const dogDist = Math.hypot(dog.x - c.x, dog.y - c.y);
             if (dogDist < 80 && !c.frozen) {
           
                // Кот замирает
            c.frozen = true;
            c.frozenTimer = 180 + Math.floor(Math.random() * 120); // 3-5 секунд
            dog.fullness = Math.max(0, dog.fullness - 5);
            dog.showStatus("WOOF!", 1);
        }
    }
}
    }

function feedDog() {
    const dog = getDog();
    if (!dog) return;
    dog.fullness = Math.min(100, dog.fullness + 25);
    dog.showHeart = true;
    setTimeout(() => { dog.showHeart = false; }, 1000);
    playBark();
}

function isColliding(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

export function setTryMove(fn) {
    window._tryMove = fn;
}