## 📋 ГОТОВЫЕ ФУНКЦИИ ДЛЯ ВСЕХ

---

### 👧 АВРОРА — АЧИВКИ

```javascript
// Функция 1: Проверить и выдать ачивку
function checkAchievement(id) {
    if (unlocked.includes(id)) return false;
    unlocked.push(id);
    localStorage.setItem('achievements', JSON.stringify(unlocked));
    return true;
}

// Функция 2: Проверить первый сыр
function checkFirstCheese(collected) {
    if (collected > 0) {
        return checkAchievement('first_cheese');
    }
    return false;
}

// Функция 3: Нарисовать значок ачивки
function drawAchievementBadge(ctx, id, x, y) {
    const ach = achievements.find(a => a.id === id);
    if (!ach) return;
    const earned = unlocked.includes(id);
    ctx.fillStyle = earned ? '#FFD700' : '#666';
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.fillText(ach.name, x, y + 40);
}
```

---

### 👦 МАТВЕЙ — СКОРОСТЬ И ЭКРАНЫ

```javascript
// Функция 1: Временно ускорить мышь
function boostSpeed(mouse, multiplier, duration) {
    mouse._originalSpeed = mouse.speed;
    mouse.speed *= multiplier;
    mouse._boostTimer = duration;
}

// Функция 2: Нарисовать главное меню
function drawMainMenu(ctx, W, H) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCITTER', W/2, H/2 - 40);
    ctx.font = '14px monospace';
    ctx.fillText('Мышь против кота', W/2, H/2);
    ctx.fillText('Нажми ENTER чтобы начать', W/2, H/2 + 40);
}

// Функция 3: Нарисовать заставку уровня
function drawLevelIntro(ctx, levelNumber, W, H) {
    const names = ['Подземелье', 'Улица', 'Дружба', 'Ловушки', 'Финал'];
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Уровень ' + (levelNumber + 1), W/2, H/2 - 20);
    ctx.fillText(names[levelNumber], W/2, H/2 + 10);
    ctx.fillText('Нажми любую клавишу', W/2, H/2 + 50);
}
```

---

### 📖 ГЕРМАН — СЮЖЕТ

```javascript
// Функция 1: Получить историю уровня
function getLevelStory(levelNumber) {
    const stories = [
        'Мышь просыпается в тёмном подземелье. Где-то рядом кот.',
        'Улицы пусты, но открытое пространство опасно.',
        'На арене появляется собака. Друг или враг?',
        'Туннели полны ловушек. Один неверный шаг — и конец.',
        'Последняя битва. Босс-кот ждёт в темноте.'
    ];
    return stories[levelNumber] || stories[0];
}

// Функция 2: Получить случайную фразу кота
function getRandomCatPhrase(state) {
    const phrases = {
        chase: ['Я вижу тебя!', 'Не убежишь!', 'Стой!', 'Сыр мой!', 'Мяу!'],
        lost: ['Где ты?', 'Я найду тебя!', 'Выходи!', 'Ты где-то здесь...'],
        victory: ['Ты победила...', 'Я ещё вернусь!', 'Мяу! В другой раз!'],
        defeat: ['Вкусный ужин!', 'Я же говорил!', 'Спи спокойно...']
    };
    const list = phrases[state] || phrases.chase;
    return list[Math.floor(Math.random() * list.length)];
}

// Функция 3: Получить подсказку уровня
function getHint(levelNumber) {
    const hints = [
        'Собери весь сыр чтобы открыть лунку',
        'На открытом пространстве сложнее спрятаться',
        'Покорми собаку костью — она защитит тебя',
        'Масло ускоряет но делает неуправляемой',
        'Красная аура означает что босс рядом'
    ];
    return hints[levelNumber] || hints[0];
}
```

---

### 💡 ДАМИР — ФОНЫ

```javascript
// Функция 1: Загрузить один фон
function loadBackground(levelNumber, path) {
    const img = new Image();
    img.src = path;
    backgrounds[levelNumber] = img;
}

// Функция 2: Нарисовать фон
function drawBackground(ctx, levelNumber) {
    const bg = backgrounds[levelNumber];
    const colors = ['#1a1a1a', '#2a2a2a', '#1a2a2a', '#1a0a0a', '#050505'];
    if (bg && bg.complete) {
        ctx.drawImage(bg, 0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
        ctx.fillStyle = colors[levelNumber] || '#111';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

// Функция 3: Загрузить все фоны
function loadAllBackgrounds() {
    loadBackground(0, 'assets/backgrounds/bg-level1.png');
    loadBackground(1, 'assets/backgrounds/bg-level2.png');
    loadBackground(2, 'assets/backgrounds/bg-level3.png');
    loadBackground(3, 'assets/backgrounds/bg-level4.png');
    loadBackground(4, 'assets/backgrounds/bg-level5.png');
}
```

---

### 🧲 МУРАД — КОСТЮМЫ

```javascript
// Функция 1: Применить костюм
function applyCostume(mouse, type) {
    mouse.currentCostume = type;
    if (type === 'armor') {
        mouse.trapImmune = true;
    } else if (type === 'speed') {
        mouse.baseSpeed = 6;
        mouse.speed = 6;
    } else if (type === 'stealth') {
        mouse.stealth = true;
    } else {
        mouse.trapImmune = false;
        mouse.stealth = false;
        mouse.baseSpeed = 4;
        mouse.speed = 4;
    }
}

// Функция 2: Получить имя спрайта костюма
function getCostumeSprite(mouse) {
    if (!mouse.currentCostume || mouse.currentCostume === 'default') {
        return 'costume-default';
    }
    return 'costume-' + mouse.currentCostume;
}
```

---

### 🔊 АРТЁМ — ЗВУКИ ПЕРСОНАЖЕЙ

```javascript
// Функция 1: Загрузить звуки персонажей
function loadCharacterSounds() {
    characterSounds.cat = new Audio('assets/sounds/characters/meow.mp3');
    characterSounds.cat.volume = 0.5;
    characterSounds.mouse = new Audio('assets/sounds/characters/squeak.mp3');
    characterSounds.mouse.volume = 0.3;
    characterSounds.dog = new Audio('assets/sounds/characters/bark.mp3');
    characterSounds.dog.volume = 0.6;
    characterSounds.cockroach = new Audio('assets/sounds/characters/cockroach.mp3');
    characterSounds.cockroach.volume = 0.2;
}

// Функция 2: Проиграть звук кота
function playCatSound() {
    const sound = characterSounds.cat;
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// Функция 3: Проиграть звук собаки
function playDogSound() {
    const sound = characterSounds.dog;
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}
```

---

### 🎵 ТИМУР — ЗВУКОВЫЕ ЭФФЕКТЫ

```javascript
// Функция 1: Загрузить звуки эффектов
function loadEffectSounds() {
    effectSounds.cheese = new Audio('assets/sounds/effects/cheese.mp3');
    effectSounds.cheese.volume = 0.4;
    effectSounds.trap = new Audio('assets/sounds/effects/trap.mp3');
    effectSounds.trap.volume = 0.6;
    effectSounds.victory = new Audio('assets/sounds/effects/victory.mp3');
    effectSounds.victory.volume = 0.5;
    effectSounds.gameover = new Audio('assets/sounds/effects/gameover.mp3');
    effectSounds.gameover.volume = 0.5;
    effectSounds.achievement = new Audio('assets/sounds/effects/achievement.mp3');
    effectSounds.achievement.volume = 0.3;
}

// Функция 2: Проиграть звук сбора сыра
function playCheeseSound() {
    const sound = effectSounds.cheese;
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// Функция 3: Проиграть звук победы
function playVictorySound() {
    const sound = effectSounds.victory;
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}
```

---

### 🕵️ МИША — ПАСХАЛКИ

```javascript
// Функция 1: Проверить секретный код
let lastKeys = [];
function checkSecretCode(key) {
    lastKeys.push(key.toLowerCase());
    if (lastKeys.length > 10) lastKeys.shift();
    if (lastKeys.join('').includes('ikode')) {
        lastKeys = [];
        return true;
    }
    return false;
}

// Функция 2: Проверить 1000 шагов
let totalSteps = 0;
function checkThousandSteps() {
    totalSteps++;
    if (totalSteps >= 1000 && !window._championShown) {
        window._championShown = true;
        return true;
    }
    return false;
}

// Функция 3: Обработать консольную команду
function checkConsoleCommand(command) {
    if (command === 'scitter.god') return 'Режим бога включён!';
    if (command === 'scitter.cheese') return 'Добавлено 99 сыра!';
    if (command === 'scitter.noclip') return 'Проход сквозь стены включён!';
    return null;
}
```

---

### ☁️ МАКС — ТЕКСТУРЫ ТАЙЛОВ

```javascript
// Функция 1: Загрузить текстуру тайла
function loadTileTexture(tileType, path) {
    const img = new Image();
    img.src = path;
    tileTextures[tileType] = img;
}

// Функция 2: Нарисовать один тайл
function drawTile(ctx, tileType, x, y) {
    const texture = tileTextures[tileType];
    const colors = { wall: '#333', floor: '#222', water: '#224', spike: '#400' };
    if (texture && texture.complete) {
        ctx.drawImage(texture, x, y, 40, 40);
    } else {
        ctx.fillStyle = colors[tileType] || '#222';
        ctx.fillRect(x, y, 40, 40);
    }
}

// Функция 3: Заполнить область тайлами
function drawTileArea(ctx, tileType, startX, startY, width, height) {
    for (let row = startY; row < startY + height; row += 40) {
        for (let col = startX; col < startX + width; col += 40) {
            drawTile(ctx, tileType, col, row);
        }
    }
}
```

---

### 🖥️ ДЕНИС — УРОВНИ

```javascript
// Функция 1: Получить настройки уровня
function getLevelConfig(levelNumber) {
    const levels = [level1, level2, level3, level4, level5];
    return levels[levelNumber] || level1;
}

// Функция 2: Создать пустую карту
function createEmptyMap(cols, rows) {
    const map = [];
    for (let r = 0; r < rows; r++) {
        map[r] = new Array(cols).fill(0);
    }
    return map;
}

// Функция 3: Нарисовать стены по краям
function addBorderWalls(map) {
    const rows = map.length;
    const cols = map[0].length;
    for (let c = 0; c < cols; c++) {
        map[0][c] = 1;
        map[rows - 1][c] = 1;
    }
    for (let r = 0; r < rows; r++) {
        map[r][0] = 1;
        map[r][cols - 1] = 1;
    }
}
```

---

### 🧠 ОЛЕГ — ЛОГИКА И ФИЗИКА

```javascript
// Функция 1: Обновить агрессию кота
function updateAggression(cat, distanceToMouse) {
    if (distanceToMouse < 100) {
        cat.aggression = Math.min(cat.aggressionMax, cat.aggression + 0.02);
    } else {
        cat.aggression = Math.max(0, cat.aggression - cat.aggressionDecay);
    }
    if (cat.aggression > 5) {
        cat.visionRange = 200;
        cat.speed = cat.baseSpeed * 1.8;
    }
}

// Функция 2: Проверить можно ли пройти
function isWalkable(x, y, worldMap, TILE_SIZE) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    if (row < 0 || row >= worldMap.length) return false;
    if (col < 0 || col >= worldMap[0].length) return false;
    return worldMap[row][col] === 0 || worldMap[row][col] === 2;
}

// Функция 3: Движение с проверкой стен
function tryMove(character, dx, dy, worldMap, TILE_SIZE) {
    const newX = character.x + dx;
    const newY = character.y + dy;
    const canX = isWalkable(newX, character.y, worldMap, TILE_SIZE) &&
                 isWalkable(newX + character.w, character.y, worldMap, TILE_SIZE) &&
                 isWalkable(newX, character.y + character.h, worldMap, TILE_SIZE) &&
                 isWalkable(newX + character.w, character.y + character.h, worldMap, TILE_SIZE);
    const canY = isWalkable(character.x, newY, worldMap, TILE_SIZE) &&
                 isWalkable(character.x + character.w, newY, worldMap, TILE_SIZE) &&
                 isWalkable(character.x, newY + character.h, worldMap, TILE_SIZE) &&
                 isWalkable(character.x + character.w, newY + character.h, worldMap, TILE_SIZE);
    if (canX) character.x = newX;
    if (canY) character.y = newY;
    return canX || canY;
}
```

---

### 🎨 ИВАН — СПРАЙТЫ

```javascript
// Функция 1: Загрузить спрайт
const spriteCache = {};
function loadSprite(name, path) {
    const img = new Image();
    img.src = path;
    spriteCache[name] = img;
}

// Функция 2: Нарисовать спрайт
function drawSprite(ctx, name, x, y, w, h) {
    const img = spriteCache[name];
    if (img && img.complete) {
        ctx.drawImage(img, x, y, w, h);
    } else {
        ctx.fillStyle = '#888';
        ctx.fillRect(x, y, w, h);
    }
}

// Функция 3: Нарисовать кадр анимации
function drawAnimatedSprite(ctx, name, x, y, w, h, frame, totalFrames) {
    const img = spriteCache[name];
    if (img && img.complete) {
        const frameWidth = img.width / totalFrames;
        ctx.drawImage(img, frame * frameWidth, 0, frameWidth, img.height, x, y, w, h);
    } else {
        ctx.fillStyle = '#888';
        ctx.fillRect(x, y, w, h);
    }
}
```
