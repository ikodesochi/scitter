// ui/menu.js
import { getCheeseCount, getBoneCount, getTotalCheeseGoal, getTotalBoneGoal, getCurrentLevelInfo, resetLevel, setGameActive } from '../systems/levelManager.js';
import { getActiveQuests, getCompletedQuests } from '../quests/questManager.js';
import { getAchievements } from '../systems/achievements.js';

let menuDiv = null;
let menuHandler = null;

export function initMenu(resetGameCallback) {
    menuDiv = document.createElement('div');
    menuDiv.id = 'pauseMenu';
    menuDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.92);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    document.body.appendChild(menuDiv);
    
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            togglePause();
        }
    });
}

function togglePause() {
    if (!menuDiv) return;
    
    if (menuDiv.style.display === 'flex') {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    updateMenuContent();
    menuDiv.style.display = 'flex';
    setGameActive(false);
    
    // Обработчик клавиш в меню
    menuHandler = (e) => {
        if (e.code === 'Escape' || e.code === 'KeyQ') {
            closeMenu();
        }
        if (e.code === 'KeyR') {
            resetLevel();
            closeMenu();
        }
    };
    window.addEventListener('keydown', menuHandler);
}

function closeMenu() {
    menuDiv.style.display = 'none';
    setGameActive(true);
    if (menuHandler) {
        window.removeEventListener('keydown', menuHandler);
        menuHandler = null;
    }
}

function drawBar(value, max, width, char) {
    const filled = Math.floor((value / max) * width);
    const empty = width - filled;
    return char.repeat(filled) + "..".repeat(Math.max(0, Math.floor(empty / 2)));
}

function drawASCIIItem(name, count, total, icon) {
    const bar = drawBar(count, total, 16, "=");
    return `${icon} ${name}: [${bar}] ${count}/${total}`;
}

function updateMenuContent() {
    const cheeseCount = getCheeseCount();
    const boneCount = getBoneCount();
    const totalCheese = getTotalCheeseGoal();
    const totalBones = getTotalBoneGoal();
    const levelInfo = getCurrentLevelInfo();
    const achievements = getAchievements();
    const activeQuests = getActiveQuests();
    const completedQuests = getCompletedQuests();
    
    const achieved = Object.entries(achievements).filter(([k, v]) => v).map(([k]) => k);
    
    // Формируем строки квестов
    let questLines = '';
    for (const q of activeQuests) {
        questLines += `| [ ] ${q.name.padEnd(28)}|\n`;
    }
    for (const q of completedQuests) {
        questLines += `| [X] ${q.name.padEnd(28)}|\n`;
    }
    if (!activeQuests.length && !completedQuests.length) {
        questLines = '| no quests                    |\n';
    }
    
    // Формируем строки достижений
    let achievementLines = '';
    if (achieved.length > 0) {
        for (const a of achieved) {
            achievementLines += `| * ${a.padEnd(30)}|\n`;
        }
    } else {
        achievementLines = '| none                         |\n';
    }
    
    const asciiArt = `
<pre style="color: #aaa; font-size: 11px; line-height: 1.3; margin: 0; font-family: 'Courier New', monospace;">
+------------------------------------+
|           SKITTER - MENU           |
+------------------------------------+
| Level: ${String(levelInfo.id).padEnd(2)} - ${levelInfo.name.padEnd(22)} |
+------------------------------------+
|                                    |
| ${drawASCIIItem("CHEESE", cheeseCount, totalCheese, "o")} |
| ${drawASCIIItem("BONES ", boneCount, totalBones, "=")}  |
|                                    |
+------------------------------------+
| QUESTS:                            |
${questLines}+------------------------------------+
| ACHIEVEMENTS:                      |
${achievementLines}+------------------------------------+
| CONTROLS:                          |
| [ARROWS] move   [ESC/Q] menu       |
| [R] restart     [Q] close menu     |
+------------------------------------+
</pre>`;
    
    menuDiv.innerHTML = `
        <div style="background: #000; border: 2px solid #555; padding: 20px; color: #ccc;">
            ${asciiArt}
            <div style="text-align: center; margin-top: 10px; font-family: 'Courier New', monospace;">
                <span style="color: #888; font-size: 11px;">[ESC] or [Q] to close  |  [R] to restart</span>
            </div>
        </div>
    `;
}