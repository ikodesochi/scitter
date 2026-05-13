// systems/shop.js
let shopVisible = false;
let shopData = null;
let shopCallback = null;

export function openShop(cockroach, mouse, cheeseCount, onClose) {
    shopData = { cockroach, mouse, cheeseCount };
    shopCallback = onClose;
    shopVisible = true;
    renderShop();
}

export function closeShop() {
    shopVisible = false;
    const panel = document.getElementById('shopPanel');
    if (panel) panel.remove();
    if (shopCallback) shopCallback();
}

export function isShopOpen() {
    return shopVisible;
}

function renderShop() {
    // Удаляем старую панель если есть
    const oldPanel = document.getElementById('shopPanel');
    if (oldPanel) oldPanel.remove();
    
    const { cockroach, mouse, cheeseCount } = shopData;
    
    const panel = document.createElement('div');
    panel.id = 'shopPanel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000;
        border: 2px solid #8B4513;
        padding: 20px;
        z-index: 2000;
        font-family: 'Courier New', monospace;
        color: #ccc;
        min-width: 300px;
    `;
    
    let itemsHTML = '';
    for (const item of cockroach.items) {
        const owned = mouse.upgrades?.includes(item.id);
        const canBuy = cheeseCount >= item.cost && !owned;
        
        itemsHTML += `
            <div style="margin: 8px 0; padding: 5px; border: 1px solid #333; ${owned ? 'opacity: 0.5;' : ''}">
                <span style="color: #ffcc00;">${item.icon}</span>
                <span style="color: #fff;"> ${item.name}</span>
                <span style="color: #aaa;"> - ${item.description}</span>
                <span style="color: #ffcc00; float: right;">${item.cost} cheese</span>
                ${owned ? 
                    '<span style="color: #0f0; float: right; margin-right: 10px;">[OWNED]</span>' :
                    `<button onclick="window.buyItem('${item.id}')" 
                        style="background: #333; color: #fff; border: 1px solid #555; cursor: pointer; float: right; margin-right: 10px;"
                        ${!canBuy ? 'disabled' : ''}>BUY</button>`
                }
            </div>
        `;
    }
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <pre style="color: #8B4513; margin: 0;">
   ___
  / _ \\\\
 | |_| |
  \\___/
            </pre>
            <h3 style="color: #8B4513; margin: 5px 0;">ROACH SHOP</h3>
            <p style="color: #aaa; font-size: 12px;">"Hey kid, want some upgrades?"</p>
        </div>
        
        <div style="margin-bottom: 10px; color: #ffcc00;">
            Your cheese: ${cheeseCount}
        </div>
        
        ${itemsHTML}
        
        <div style="text-align: center; margin-top: 15px;">
            <button onclick="window.closeShop()" style="
                background: #333; color: #aaa; border: 1px solid #555;
                padding: 5px 20px; cursor: pointer; font-family: monospace;
            ">LEAVE [ESC]</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Глобальные функции для кнопок
    window.buyItem = (itemId) => {
        const item = cockroach.items.find(i => i.id === itemId);
        if (item && cheeseCount >= item.cost) {
            item.apply(mouse);
            if (!mouse.upgrades) mouse.upgrades = [];
            mouse.upgrades.push(itemId);
            shopData.cheeseCount -= item.cost;
            renderShop();
        }
    };
    
    window.closeShop = () => closeShop();
    
    // Обработчик ESC
    const escHandler = (e) => {
        if (e.code === 'Escape') {
            closeShop();
            window.removeEventListener('keydown', escHandler);
        }
    };
    window.addEventListener('keydown', escHandler);
}

// Клавиша E для открытия магазина
export function initShopInput() {
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyE' && !shopVisible) {
            // Будет вызываться из game.js
        }
    });
}