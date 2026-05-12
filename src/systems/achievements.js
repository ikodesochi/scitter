// systems/achievements.js

let achievements = {
    firstCheese: false,
    cheeseMaster: false,
    friendship: false,
    speedBoots: false,
    explorer: false
};

let cheeseCollected = 0;
let bonesCollected = 0;
let chestsFound = 0;
let catEvades = 0;

export function initAchievements() {
    const saved = localStorage.getItem("skitter_achievements");
    if (saved) {
        try {
            const data = JSON.parse(saved);
            achievements = { ...achievements, ...data };
        } catch(e) {
            console.warn("Не удалось загрузить ачивки");
        }
    }
}

export function saveAchievements() {
    localStorage.setItem("skitter_achievements", JSON.stringify(achievements));
}

export function updateAchievements(event) {
    if (event.type === "cheese") {
        cheeseCollected += event.value;
        if (!achievements.firstCheese && cheeseCollected >= 1) {
            achievements.firstCheese = true;
            showAchievement("Первый сыр!", "Собран первый кусочек сыра");
        }
        if (!achievements.cheeseMaster && cheeseCollected >= 20) {
            achievements.cheeseMaster = true;
            showAchievement("Сырный король", "Собрано 20 кусочков сыра");
        }
    }
    
    if (event.type === "bone") {
        bonesCollected += event.value;
        if (!achievements.friendship && bonesCollected >= 10) {
            achievements.friendship = true;
            showAchievement("Лучший друг", "Собрано 10 костей для собаки");
        }
    }
    
    if (event.type === "chest") {
        chestsFound += event.value;
        if (!achievements.explorer && chestsFound >= 3) {
            achievements.explorer = true;
            showAchievement("Исследователь", "Найдено 3 секретных сундука");
        }
    }
    
    if (event.type === "evade") {
        catEvades += event.value;
        if (!achievements.speedBoots && catEvades >= 10) {
            achievements.speedBoots = true;
            showAchievement("Скоростные ботинки", "10 раз увернулся от кота");
        }
    }
    
    saveAchievements();
}

function showAchievement(title, message) {
    console.log(`🏆 ДОСТИЖЕНИЕ: ${title} — ${message}`);
    // Здесь можно добавить всплывающее уведомление на экране
}

export function getAchievements() {
    return { ...achievements };
}