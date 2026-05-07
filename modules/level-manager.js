// modules/levelManager.js
// Модуль управления уровнями: загрузка, переходы, условия победы

// ---------- ПЕРЕМЕННЫЕ УРОВНЕЙ ----------
let currentLevel = 1;           // текущий уровень (1–5)
let totalLevels = 5;            // всего уровней в игре
let levelData = {};             // загруженные данные уровня
let levelComplete = false;      // завершён ли текущий уровень
let levelMaps = [];             // массив карт для каждого уровня

// ---------- ЗАГРУЗКА УРОВНЯ ----------
// Загружает данные уровня из файла levels/levelXX.js
// В реальном проекте здесь должен быть импорт, но для простоты используем объекты
function loadLevel(levelNumber) {
    switch(levelNumber) {
        case 1:
            levelData = {
                map: [
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1]
                ],
                mouseStart: { x: 80, y: 80 },
                catStart: { x: 300, y: 300 },
                dogStart: null,
                requiredCheese: 3,
                requiredBones: 0,
                catSettings: {
                    isAggressive: false,
                    speed: 1.5,
                    viewRadius: 150,
                    viewAngle: 90
                },
                fearSettings: { enabled: false, baseSpeed: 4 },
                dogSettings: { enabled: false },
                timeLimit: 0
            };
            break;
        case 2:
            levelData = {
                map: [
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1]
                ],
                mouseStart: { x: 80, y: 80 },
                catStart: { x: 300, y: 300 },
                dogStart: null,
                requiredCheese: 4,
                requiredBones: 0,
                catSettings: {
                    isAggressive: true,     // кот уже преследует
                    speed: 2.0,
                    viewRadius: 150,
                    viewAngle: 90
                },
                fearSettings: { enabled: false, baseSpeed: 4 },
                dogSettings: { enabled: false },
                timeLimit: 0
            };
            break;
        case 3:
            levelData = {
                map: [
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1]
                ],
                mouseStart: { x: 80, y: 80 },
                catStart: { x: 300, y: 300 },
                dogStart: null,
                requiredCheese: 5,
                requiredBones: 0,
                catSettings: {
                    isAggressive: true,
                    speed: 2.5,
                    viewRadius: 150,
                    viewAngle: 90
                },
                fearSettings: { enabled: true, baseSpeed: 4 },   // страх включён
                dogSettings: { enabled: false },
                timeLimit: 120   // 2 минуты
            };
            break;
        case 4:
            levelData = {
                map: [
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1]
                ],
                mouseStart: { x: 80, y: 80 },
                catStart: { x: 300, y: 300 },
                dogStart: { x: 500, y: 500 },
                requiredCheese: 5,
                requiredBones: 3,
                catSettings: {
                    isAggressive: true,
                    speed: 2.8,
                    viewRadius: 150,
                    viewAngle: 90
                },
                fearSettings: { enabled: true, baseSpeed: 4 },
                dogSettings: {
                    enabled: true,
                    fullness: 100,
                    protectionRadius: 80
                },
                timeLimit: 150
            };
            break;
        case 5:
            levelData = {
                map: [
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,1,1,1,0,1,1,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1]
                ],
                mouseStart: { x: 80, y: 80 },
                catStart: { x: 300, y: 300 },
                dogStart: { x: 500, y: 500 },
                requiredCheese: 7,
                requiredBones: 5,
                catSettings: {
                    isAggressive: true,
                    speed: 3.2,
                    viewRadius: 150,
                    viewAngle: 90
                },
                fearSettings: { enabled: true, baseSpeed: 4 },
                dogSettings: {
                    enabled: true,
                    fullness: 100,
                    protectionRadius: 80
                },
                timeLimit: 180
            };
            break;
        default:
            console.error("Неизвестный уровень:", levelNumber);
            return null;
    }
    
    return levelData;
}

// ---------- ПРОВЕРКА УСЛОВИЙ ПЕРЕХОДА ----------
function checkLevelCompletion(score, cheeseCollected, requiredCheese, bonesCollected, requiredBones) {
    // Проверяем, собрано ли достаточно сыра и костей
    const cheeseCondition = cheeseCollected >= requiredCheese;
    const bonesCondition = (requiredBones === 0) || (bonesCollected >= requiredBones);
    
    if (cheeseCondition && bonesCondition) {
        levelComplete = true;
        return true;
    }
    return false;
}

// ---------- ПЕРЕХОД НА СЛЕДУЮЩИЙ УРОВЕНЬ ----------
function goToNextLevel() {
    if (!levelComplete) return false;
    
    if (currentLevel < totalLevels) {
        currentLevel++;
        levelComplete = false;
        return true;
    } else {
        // Игра пройдена
        return true;  // победа
    }
}

// ---------- ПОЛУЧЕНИЕ ДАННЫХ ТЕКУЩЕГО УРОВНЯ ----------
function getCurrentLevelData() {
    if (!levelData.map) {
        levelData = loadLevel(currentLevel);
    }
    return levelData;
}

// ---------- СБРОС УРОВНЯ (при смерти/рестарте) ----------
function resetCurrentLevel() {
    levelData = loadLevel(currentLevel);
    levelComplete = false;
}

// ---------- ПОЛУЧЕНИЕ КАРТЫ ----------
function getCurrentMap() {
    return levelData.map;
}

// ---------- ПОЛУЧЕНИЕ НАСТРОЕК КОТА ----------
function getCatSettings() {
    return levelData.catSettings || {};
}

// ---------- ПОЛУЧЕНИЕ НАСТРОЕК СТРАХА ----------
function getFearSettings() {
    return levelData.fearSettings || { enabled: false, baseSpeed: 4 };
}

// ---------- ПОЛУЧЕНИЕ НАСТРОЕК СОБАКИ ----------
function getDogSettings() {
    return levelData.dogSettings || { enabled: false };
}

// ---------- ПОЛУЧЕНИЕ ТАЙМЕРА ----------
function getTimeLimit() {
    return levelData.timeLimit || 0;
}

// ---------- ПОЛУЧЕНИЕ НАЗВАНИЯ УРОВНЯ ----------
function getLevelName() {
    const names = {
        1: "Мышь-собиратель",
        2: "Спокойный кот",
        3: "Опасный кот",
        4: "Страх и защита",
        5: "Финальная битва"
    };
    return names[currentLevel] || "Уровень " + currentLevel;
}

// ---------- ПОЛУЧЕНИЕ ОПИСАНИЯ УРОВНЯ ----------
function getLevelDescription() {
    const descriptions = {
        1: "Собирай сыр. Кот пока не опасен.",
        2: "Кот начал следить за тобой. Не попадайся!",
        3: "Кот охотится. Твой страх замедляет тебя.",
        4: "Собака поможет, если накормить её костями.",
        5: "Последний уровень. Собери всё, что нужно!"
    };
    return descriptions[currentLevel] || "Пройди уровень";
}

// ---------- ФЛАГ ПОБЕДЫ ----------
function isGameCompleted() {
    return currentLevel > totalLevels;
}

// Экспорт (для использования в game.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        currentLevel,
        totalLevels,
        levelComplete,
        loadLevel,
        checkLevelCompletion,
        goToNextLevel,
        getCurrentLevelData,
        resetCurrentLevel,
        getCurrentMap,
        getCatSettings,
        getFearSettings,
        getDogSettings,
        getTimeLimit,
        getLevelName,
        getLevelDescription,
        isGameCompleted
    };
}