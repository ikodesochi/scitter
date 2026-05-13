// systems/admin.js
// Админ-панель для отладки игры
// Вызывается клавишей \ (обратный слеш)
// Управление: стрелки вверх/вниз для выбора, Enter для переключения

let adminMode = false;
let adminPanel = null;
let selectedIndex = 0;

// Все режимы переключаются (ON/OFF)
const adminFeatures = [
    { key: 'NOCLIP', active: false },       // Ходить сквозь стены
    { key: 'GOD', active: false },          // Бессмертие
    { key: 'SPEED', active: false },        // Ускорение
    { key: 'INFO', active: false },         // Отладочная информация
    { key: 'VISION', active: false },       // Полная видимость (убирает туман)
    { key: 'HOLE', active: false },         // Активировать лунку
    { key: '+100 CHEESE', active: false },  // Добавить 100 сыра
    { key: '+100 BONES', active: false }    // Добавить 100 костей
];

// Список уровней для быстрого перехода
const adminLevels = [
    { key: '1', name: 'Underground' },
    { key: '2', name: 'Darkness' },
    { key: '3', name: 'Street' },
    { key: '4', name: 'Friendship' },
    { key: '5', name: 'Traps' },
    { key: '6', name: 'Final Boss' },
    { key: '0', name: 'Ventilation' }
];

export function initAdmin() {
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Backslash') {
            toggleAdmin();
            e.preventDefault();
        }
        if (adminMode) handleAdminKey(e);
    });
}

function handleAdminKey(e) {
    if (e.code === 'ArrowUp') {
        selectedIndex = Math.max(0, selectedIndex - 1);
        updatePanel();
        e.preventDefault();
    }
    
    if (e.code === 'ArrowDown') {
        selectedIndex = Math.min(adminFeatures.length + adminLevels.length - 1, selectedIndex + 1);
        updatePanel();
        e.preventDefault();
    }
    
    if (e.code === 'Enter') {
        if (selectedIndex < adminFeatures.length) {
            const feature = adminFeatures[selectedIndex];
            // Переключаем ON/OFF
            feature.active = !feature.active;
            
            // Дополнительные действия при переключении
            if (feature.key === 'HOLE') {
                if (window._toggleHole) window._toggleHole();
            } else if (feature.key === '+100 CHEESE') {
                if (window._setCheeseBoost) window._setCheeseBoost(feature.active);
            } else if (feature.key === '+100 BONES') {
                if (window._setBoneBoost) window._setBoneBoost(feature.active);
            }
        } else {
            const levelIndex = selectedIndex - adminFeatures.length;
            const level = adminLevels[levelIndex];
            if (level.key === '0') {
                if (window._enterShop) window._enterShop();
            } else {
                const lvl = parseInt(level.key) - 1;
                if (window._skipToLevel) window._skipToLevel(lvl);
            }
        }
        updatePanel();
        e.preventDefault();
    }
    
    if (e.code === 'Escape' && adminMode) {
        toggleAdmin();
        e.preventDefault();
    }
}

function toggleAdmin() {
    adminMode = !adminMode;
    if (adminMode) {
        selectedIndex = 0;
        createPanel();
    } else {
        removePanel();
    }
}

function createPanel() {
    if (adminPanel) return;
    adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.92);
        border: 1px solid #f00;
        padding: 10px;
        z-index: 3000;
        font-family: monospace;
        font-size: 11px;
        color: #888;
        min-width: 180px;
    `;
    updatePanel();
    document.body.appendChild(adminPanel);
}

function removePanel() {
    if (adminPanel) {
        adminPanel.remove();
        adminPanel = null;
    }
}

function updatePanel() {
    if (!adminPanel) return;
    
    let html = `
        <div style="text-align:center; margin-bottom:5px; color:#f00; font-weight:bold;">
            \\\\ ADMIN //
        </div>
        <div style="font-size:9px; color:#555; margin-bottom:5px;">
            arrows: select  enter: toggle
        </div>
    `;
    
    for (let i = 0; i < adminFeatures.length; i++) {
        const f = adminFeatures[i];
        const sel = i === selectedIndex ? '>' : ' ';
        const color = f.active ? '#0f0' : '#666';
        html += `
            <div style="margin:2px 0; color:${color}; ${i === selectedIndex ? 'background:#222;' : ''}">
                ${sel} ${f.key}: ${f.active ? 'ON' : 'OFF'}
            </div>
        `;
    }
    
    html += `<div style="margin:5px 0; border-top:1px solid #333;"></div>`;
    
    for (let i = 0; i < adminLevels.length; i++) {
        const l = adminLevels[i];
        const idx = i + adminFeatures.length;
        const sel = idx === selectedIndex ? '>' : ' ';
        html += `
            <div style="margin:2px 0; color:#666; ${idx === selectedIndex ? 'background:#222;' : ''}">
                ${sel} [${l.key}] ${l.name}
            </div>
        `;
    }
    
    html += `
        <div style="margin-top:5px; font-size:9px; color:#444;">
            \\\\ or ESC to close
        </div>
    `;
    
    adminPanel.innerHTML = html;
}

export function isAdminMode() { return adminMode; }
export function isNoclip() { return adminMode && adminFeatures[0].active; }
export function isGodmode() { return adminMode && adminFeatures[1].active; }
export function isSpeedBoost() { return adminMode && adminFeatures[2].active; }
export function isShowInfo() { return adminMode && adminFeatures[3].active; }
export function isFullVision() { return adminMode && adminFeatures[4].active; }