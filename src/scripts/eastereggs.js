// scripts/eastereggs.js
// Пасхалки игры Scitter
// Набери "ikode" во время игры → появится iKODe-кот!

let typedKeys = '';
let iKodeActive = false;
let iKodeTimer = 0;

export function initEasterEggs() {
    window.addEventListener('keydown', (e) => {
        // Собираем последние 5 нажатых клавиш
        typedKeys += e.key.toLowerCase();
        if (typedKeys.length > 5) typedKeys = typedKeys.slice(-5);
        
        // Пасхалка: набрать "ikode"
        if (typedKeys === 'ikode' && !iKodeActive) {
            activateIKodeCat();
            typedKeys = '';
        }
    });
}

function activateIKodeCat() {
    iKodeActive = true;
    iKodeTimer = 300; // 5 секунд (60fps × 5)
    console.log('🐱 iKODe-кот появился!');
}

// Обновление пасхалки (вызывается из game.js каждый кадр)
export function updateEasterEggs() {
    if (iKodeActive) {
        iKodeTimer--;
        if (iKodeTimer <= 0) {
            iKodeActive = false;
        }
    }
}

// Рисуем iKODe-кота поверх игры
export function drawIKodeCat(ctx) {
    if (!iKodeActive) return;
    
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const time = Date.now() / 300;
    const bounce = Math.sin(time) * 10;
    
    // Жёлтая кепка
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(W/2 - 30, H/2 - 80 + bounce, 60, 25);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('>_', W/2 - 12, H/2 - 62 + bounce);
    
    // Голова (белая)
    ctx.fillStyle = '#fff';
    ctx.fillRect(W/2 - 40, H/2 - 55 + bounce, 80, 50);
    
    // Очки
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(W/2 - 25, H/2 - 45 + bounce, 20, 20);
    ctx.strokeRect(W/2 + 5, H/2 - 45 + bounce, 20, 20);
    // Мостик очков
    ctx.beginPath();
    ctx.moveTo(W/2 - 5, H/2 - 35 + bounce);
    ctx.lineTo(W/2 + 5, H/2 - 35 + bounce);
    ctx.stroke();
    
    // Глаза
    ctx.fillStyle = '#000';
    ctx.fillRect(W/2 - 19, H/2 - 39 + bounce, 8, 8);
    ctx.fillRect(W/2 + 11, H/2 - 39 + bounce, 8, 8);
    
    // Уши
    ctx.fillStyle = '#fff';
    ctx.fillRect(W/2 - 40, H/2 - 70 + bounce, 20, 25);
    ctx.fillRect(W/2 + 20, H/2 - 70 + bounce, 20, 25);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(W/2 - 35, H/2 - 65 + bounce, 10, 15);
    ctx.fillRect(W/2 + 25, H/2 - 65 + bounce, 10, 15);
    
    // Тело (жёлтая футболка)
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(W/2 - 35, H/2 - 5 + bounce, 70, 60);
    
    // Надпись iKODe на футболке
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('iKODe', W/2 - 28, H/2 + 30 + bounce);
    
    // Лапы
    ctx.fillStyle = '#fff';
    ctx.fillRect(W/2 - 45, H/2 + 10 + bounce, 15, 40);
    ctx.fillRect(W/2 + 30, H/2 + 10 + bounce, 15, 40);
    
    // Свиток в левой лапе
    ctx.fillStyle = '#f5deb3';
    ctx.fillRect(W/2 - 80, H/2 + 5 + bounce, 50, 35);
    ctx.fillStyle = '#0a0';
    ctx.font = '7px monospace';
    ctx.fillText('ЕСЛИ сыр', W/2 - 75, H/2 + 18 + bounce);
    ctx.fillText('ТО +10 очков', W/2 - 75, H/2 + 28 + bounce);
    
    // Перо в правой лапе
    ctx.fillStyle = '#fff';
    ctx.fillRect(W/2 + 40, H/2 + 0 + bounce, 6, 30);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(W/2 + 38, H/2 - 5 + bounce, 10, 10);
    
    // Звёздочки вокруг
    const stars = ['⭐','🧀','🐭','🐱','💻'];
    for (let i = 0; i < 5; i++) {
        const angle = time + i * Math.PI * 2 / 5;
        const sx = W/2 + Math.cos(angle) * 100;
        const sy = H/2 + Math.sin(angle) * 80 + bounce;
        ctx.font = '20px monospace';
        ctx.fillText(stars[i], sx - 10, sy + 5);
    }
    
    // Подпись
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('iKODe — код, который ты создаёшь сам!', W/2 - 180, H/2 + 100 + bounce);
}

// Проверка активна ли пасхалка
export function isIKodeActive() {
    return iKodeActive;
}