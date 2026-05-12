// systems/gameManager.js
import { getMouse, getCat, getDog, isGameActive, setGameActive, resetLevel, getCheeses, getBones, getHole, collectCheese, collectBone, getCheeseCount, getBoneCount } from './levelManager.js';

export function updateGame(tryMove) {
    if (!isGameActive()) return;
    
    const mouse = getMouse();
    const cat = getCat();
    const dog = getDog();
    
    // Сбор сыра
    const cheeses = getCheeses();
    for (let i = 0; i < cheeses.length; i++) {
        const cheese = cheeses[i];
        if (!cheese.collected &&
            mouse.x < cheese.x + cheese.w && mouse.x + mouse.w > cheese.x &&
            mouse.y < cheese.y + cheese.h && mouse.y + mouse.h > cheese.y) {
            collectCheese(i);
        }
    }
    
    // Сбор костей
    const bones = getBones();
    for (let i = 0; i < bones.length; i++) {
        const bone = bones[i];
        if (!bone.collected &&
            mouse.x < bone.x + bone.w && mouse.x + mouse.w > bone.x &&
            mouse.y < bone.y + bone.h && mouse.y + mouse.h > bone.y) {
            collectBone(i);
        }
    }
    
    // Проверка лунки
    const hole = getHole();
    if (hole && hole.active &&
        mouse.x < hole.x + hole.w && mouse.x + mouse.w > hole.x &&
        mouse.y < hole.y + hole.h && mouse.y + mouse.h > hole.y) {
        console.log("Уровень пройден! Переход на следующий уровень");
        resetLevel();
    }
    
    // Проверка поражения
    if (cat.x < mouse.x + mouse.w && cat.x + cat.w > mouse.x &&
        cat.y < mouse.y + mouse.h && cat.y + cat.h > mouse.y) {
        setGameActive(false);
        console.log("Кот поймал мышь!");
        setTimeout(() => {
            resetLevel();
            setGameActive(true);
        }, 1000);
    }
    
    // Собака защищает мышь от кота
    const dogDist = Math.hypot(dog.x - cat.x, dog.y - cat.y);
    if (dog.fullness > 0 && dogDist < 80) {
        const angle = Math.atan2(cat.y - dog.y, cat.x - dog.x);
        cat.x += Math.cos(angle) * 15;
        cat.y += Math.sin(angle) * 15;
        dog.fullness = Math.max(0, dog.fullness - 5);
    }
}