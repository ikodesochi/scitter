// modules/ui.js
// Модуль пользовательского интерфейса: отрисовка шкал, кнопок, экранов

// ---------- ПЕРЕМЕННЫЕ UI ----------
let uiElements = {
    showFearBar: true,      // показывать шкалу страха
    showDogFullnessBar: true, // показывать шкалу сытости собаки
    showTimer: true,        // показывать таймер уровня
    showScore: true,        // показывать счёт
    showControls: true,     // показывать подсказки управления
    showLevelInfo: true     // показывать название и описание уровня
};

// ---------- ОТРИСОВКА ШКАЛЫ СТРАХА ----------
function drawFearBar(ctx, fear, x, y, width = 200, height = 20) {
    if (!uiElements.showFearBar) return;
    
    // Фон шкалы
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, width, height);
    
    // Заполнение (цвет от зелёного к красному)
    const filledWidth = (fear / 100) * width;
    const red = Math.min(255, Math.floor(255 * (fear / 100)));
    const green = Math.min(255, Math.floor(255 * (1 - fear / 100)));
    ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
    ctx.fillRect(x, y, filledWidth, height);
    
    // Рамка
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(x, y, width, height);
    
    // Текст
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Страх: ${Math.floor(fear)}%`, x + 5, y - 5);
}

// ---------- ОТРИСОВКА ШКАЛЫ СЫТОСТИ СОБАКИ ----------
function drawDogFullnessBar(ctx, fullness, maxFullness, x, y, width = 200, height = 20) {
    if (!uiElements.showDogFullnessBar) return;
    
    // Фон
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, width, height);
    
    // Заполнение (синий → зелёный)
    const filledWidth = (fullness / maxFullness) * width;
    const green = Math.min(255, Math.floor(255 * (fullness / maxFullness)));
    ctx.fillStyle = `rgb(0, ${green}, 100)`;
    ctx.fillRect(x, y, filledWidth, height);
    
    // Рамка
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(x, y, width, height);
    
    // Текст
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Сытость собаки: ${Math.floor(fullness)}%`, x + 5, y - 5);
}

// ---------- ОТРИСОВКА ТАЙМЕРА ----------
function drawTimer(ctx, timeLeft, x, y) {
    if (!uiElements.showTimer) return;
    if (timeLeft <= 0) return;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    ctx.fillStyle = timeLeft < 10 ? '#ff6666' : '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText(`⏱️ ${timeString}`, x, y);
}

// ---------- ОТРИСОВКА СЧЁТА ----------
function drawScore(ctx, score, x, y) {
    if (!uiElements.showScore) return;
    
    ctx.fillStyle = '#ffcc44';
    ctx.font = '24px monospace';
    ctx.fillText(`🧀 ${Math.floor(score)}`, x, y);
}

// ---------- ОТРИСОВКА ПОДСКАЗОК УПРАВЛЕНИЯ ----------
function drawControls(ctx, x, y) {
    if (!uiElements.showControls) return;
    
    ctx.fillStyle = '#88ff88';
    ctx.font = '12px monospace';
    ctx.fillText('← ↑ ↓ → / WASD', x, y);
    ctx.fillText('Собирай сыр', x, y + 20);
    ctx.fillText('Корми собаку костями 🦴', x, y + 40);
}

// ---------- ОТРИСОВКА НАЗВАНИЯ И ОПИСАНИЯ УРОВНЯ ----------
function drawLevelInfo(ctx, levelName, levelDescription, x, y) {
    if (!uiElements.showLevelInfo) return;
    
    ctx.fillStyle = '#00ff41';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(levelName, x, y);
    
    ctx.fillStyle = '#cccccc';
    ctx.font = '12px monospace';
    ctx.fillText(levelDescription, x, y + 25);
}

// ---------- ОТРИСОВКА ЭКРАНА GAME OVER ----------
function drawGameOver(ctx, width, height, score) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#ff6666';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('GAME OVER', width / 2 - 100, height / 2 - 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText(`Собрано сыра: ${Math.floor(score)}`, width / 2 - 120, height / 2);
    
    ctx.font = '16px monospace';
    ctx.fillText('Нажми "Новая игра"', width / 2 - 100, height / 2 + 80);
}

// ---------- ОТРИСОВКА ЭКРАНА ПОБЕДЫ (ПРОЙДЕН ВЕСЬ КУРС) ----------
function drawVictory(ctx, width, height, totalScore) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('ПОБЕДА!', width / 2 - 70, height / 2 - 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText(`Ты прошёл все уровни!`, width / 2 - 130, height / 2 - 10);
    ctx.fillText(`Общий счёт: ${Math.floor(totalScore)}`, width / 2 - 110, height / 2 + 30);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = '16px monospace';
    ctx.fillText('Ты стал настоящим хранителем сыра!', width / 2 - 170, height / 2 + 90);
    ctx.fillText('Нажми "Новая игра"', width / 2 - 100, height / 2 + 130);
}

// ---------- ОТРИСОВКА ПЕРЕХОДА МЕЖДУ УРОВНЯМИ ----------
function drawLevelTransition(ctx, width, height, levelNumber, levelName) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`УРОВЕНЬ ${levelNumber}`, width / 2 - 100, height / 2 - 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.fillText(levelName, width / 2 - 80, height / 2 + 10);
    
    ctx.font = '16px monospace';
    ctx.fillText('Нажми любую клавишу для продолжения...', width / 2 - 180, height / 2 + 80);
}

// ---------- ОТРИСОВКА СООБЩЕНИЯ (например, "собрал кость") ----------
let messageQueue = [];

function showMessage(text, color = '#ffffff', duration = 60) {
    messageQueue.push({
        text: text,
        color: color,
        timer: duration
    });
}

function drawMessages(ctx, x, y) {
    let offset = 0;
    for (let i = 0; i < messageQueue.length; i++) {
        const msg = messageQueue[i];
        ctx.fillStyle = msg.color;
        ctx.font = '14px monospace';
        ctx.fillText(msg.text, x, y + offset);
        offset += 20;
        
        // Уменьшаем таймер
        msg.timer--;
    }
    
    // Удаляем истёкшие сообщения
    messageQueue = messageQueue.filter(msg => msg.timer > 0);
}

// ---------- НАСТРОЙКА ВИДИМОСТИ ЭЛЕМЕНТОВ UI ----------
function setUIVisibility(options) {
    if (options.showFearBar !== undefined) uiElements.showFearBar = options.showFearBar;
    if (options.showDogFullnessBar !== undefined) uiElements.showDogFullnessBar = options.showDogFullnessBar;
    if (options.showTimer !== undefined) uiElements.showTimer = options.showTimer;
    if (options.showScore !== undefined) uiElements.showScore = options.showScore;
    if (options.showControls !== undefined) uiElements.showControls = options.showControls;
    if (options.showLevelInfo !== undefined) uiElements.showLevelInfo = options.showLevelInfo;
}

// ---------- СБРОС СООБЩЕНИЙ (ПРИ НОВОЙ ИГРЕ) ----------
function clearMessages() {
    messageQueue = [];
}

// ---------- ЭКСПОРТ ----------
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        drawFearBar,
        drawDogFullnessBar,
        drawTimer,
        drawScore,
        drawControls,
        drawLevelInfo,
        drawGameOver,
        drawVictory,
        drawLevelTransition,
        showMessage,
        drawMessages,
        setUIVisibility,
        clearMessages,
        uiElements
    };
}