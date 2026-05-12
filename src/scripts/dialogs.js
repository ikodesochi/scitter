// scripts/dialogs.js

let lastDialogTime = 0;
let dialogQueue = [];
let currentDialog = null;

const DIALOGS = {
    cheese: [
        "🧀 Отличный сыр! Хрустит как надо.",
        "🧀 Ещё кусочек! Собака не узнает.",
        "🧀 Сырный путь — путь воина."
    ],
    cat_near: [
        "😾 Кот рядом! Беги быстрее!",
        "😾 Слышишь это мяу? Он близко.",
        "😾 Не оборачивайся, просто беги."
    ],
    dog_feed: [
        "🐕 Собака довольно виляет хвостом.",
        "🐕 Пёс сыт и готов защищать.",
        "🐕 Хороший пёс! Теперь ты в безопасности."
    ],
    chest: [
        "📦 Сундук открыт! Внутри сокровище.",
        "📦 Старый сундук, но награда щедрая.",
        "📦 Ты нашёл секрет! +5 к удаче."
    ],
    game_over: [
        "💀 Кот победил... Начни заново.",
        "💀 Мышь в лапах. Но ты можешь попробовать ещё.",
        "💀 Проигрыш — это опыт. Не сдавайся."
    ],
    victory: [
        "🏆 Ты выжил! Поздравляю!",
        "🏆 Мышь сбежала! Финал, достойный героя.",
        "🏆 Игра пройдена! Твоё имя в истории."
    ]
};

export function showDialog(category, force = false) {
    const now = Date.now();
    if (!force && now - lastDialogTime < 5000) return;
    
    const messages = DIALOGS[category];
    if (!messages) return;
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    currentDialog = messages[randomIndex];
    lastDialogTime = now;
    
    // Диалог живёт 4 секунды
    setTimeout(() => {
        if (currentDialog === messages[randomIndex]) {
            currentDialog = null;
        }
    }, 4000);
}

export function drawDialog(ctx, x, y) {
    if (!currentDialog) return;
    
    ctx.font = "14px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillRect(x - 10, y - 30, currentDialog.length * 8 + 20, 30);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 8, y - 28, currentDialog.length * 8 + 16, 26);
    ctx.fillStyle = "#000000";
    ctx.fillText(currentDialog, x, y - 12);
}

export function clearDialog() {
    currentDialog = null;
}