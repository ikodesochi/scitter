// ui/menu.js
import { getCheeseCount, getBoneCount, getTotalCheeseGoal, getTotalBoneGoal } from '../systems/levelManager.js';

export function initMenu(resetGameCallback) {
    const menuDiv = document.createElement('div');
    menuDiv.id = 'gameMenu';
    menuDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        font-family: 'Courier New', monospace;
    `;
    
    const menuContent = document.createElement('div');
    menuContent.style.cssText = `
        background: #111;
        border: 1px solid #333;
        padding: 30px 40px;
        text-align: center;
        min-width: 300px;
    `;
    
    function updateMenuContent() {
        const cheeseCount = getCheeseCount ? getCheeseCount() : 0;
        const boneCount = getBoneCount ? getBoneCount() : 0;
        const totalCheese = getTotalCheeseGoal ? getTotalCheeseGoal() : 15;
        const totalBones = getTotalBoneGoal ? getTotalBoneGoal() : 8;
        
        menuContent.innerHTML = `
            <h2 style="color:#fff; margin-bottom:20px;">⏸ ПАУЗА</h2>
            <div style="color:#ccc; margin-bottom:20px; text-align:left;">
                <p>📋 ЗАДАНИЯ:</p>
                <p>🧀 Собрано сыра: ${cheeseCount}/${totalCheese}</p>
                <p>🦴 Собрано костей: ${boneCount}/${totalBones}</p>
            </div>
            <button id="menuNewGameBtn" style="
                background: #222;
                color: #fff;
                border: 1px solid #444;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                font-family: monospace;
                font-size: 16px;
            ">🔄 НОВАЯ ИГРА</button>
            <br>
            <a href="https://github.com/ikode" target="_blank" id="menuGitHubLink" style="
                display: inline-block;
                background: #222;
                color: #fff;
                border: 1px solid #444;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                font-family: monospace;
                font-size: 16px;
                text-decoration: none;
            ">🐙 GITHUB</a>
            <br>
            <button id="menuCloseBtn" style="
                background: #333;
                color: #aaa;
                border: none;
                padding: 5px 15px;
                margin-top: 15px;
                cursor: pointer;
                font-family: monospace;
                font-size: 12px;
            ">ЗАКРЫТЬ (ESC)</button>
        `;
        
        const newGameBtn = document.getElementById('menuNewGameBtn');
        const closeBtn = document.getElementById('menuCloseBtn');
        
        if (newGameBtn) {
            newGameBtn.onclick = () => {
                if (resetGameCallback) resetGameCallback();
                menuDiv.style.display = 'none';
            };
        }
        if (closeBtn) {
            closeBtn.onclick = () => {
                menuDiv.style.display = 'none';
            };
        }
    }
    
    updateMenuContent();
    menuDiv.appendChild(menuContent);
    document.body.appendChild(menuDiv);
    
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            if (menuDiv.style.display === 'flex') {
                menuDiv.style.display = 'none';
            } else {
                updateMenuContent();
                menuDiv.style.display = 'flex';
            }
        }
    });
    
    return menuDiv;
}