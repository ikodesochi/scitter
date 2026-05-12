// scripts/eastereggs.js
import { addItem } from '../inventory/inventory.js';
import { updateAchievements } from '../systems/achievements.js';

let secretCounter = 0;
let lastCheeseTime = 0;
let secretCombo = "";

export function checkEasterEggs(keys, mouse, cat) {
    // Секретная комбинация клавиш: K + O + T
    if (keys.KeyK && keys.KeyO && keys.KeyT) {
        if (!window.eggKotActivated) {
            window.eggKotActivated = true;
            addItem("cheese", 5);
            updateAchievements({ type: "easteregg", name: "kot" });
            console.log("🥚 Пасхалка КОТ! +5 сыра");
        }
    }
    
    // Секретная комбинация: M + O + U + S + E
    if (keys.KeyM && keys.KeyO && keys.KeyU && keys.KeyS && keys.KeyE) {
        if (!window.eggMouseActivated) {
            window.eggMouseActivated = true;
            cat.speed = 0.5;
            setTimeout(() => { cat.speed = 2.2; }, 10000);
            console.log("🥚 Пасхалка МЫШЬ! Кот замедлен на 10 секунд");
        }
    }
    
    // Если мышь стоит на месте 30 секунд
    const now = Date.now();
    if (Math.abs(mouse.x - mouse.lastX) < 5 && Math.abs(mouse.y - mouse.lastY) < 5) {
        if (!window.idleTimer) {
            window.idleTimer = now;
        } else if (now - window.idleTimer > 30000 && !window.eggIdleActivated) {
            window.eggIdleActivated = true;
            addItem("cheese", 3);
            console.log("🥚 Пасхалка СТОЙКА! +3 сыра");
        }
    } else {
        window.idleTimer = null;
    }
    
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
}

export function resetEasterEggs() {
    window.eggKotActivated = false;
    window.eggMouseActivated = false;
    window.eggIdleActivated = false;
    window.idleTimer = null;
}