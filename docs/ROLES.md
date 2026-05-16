## 👨‍🏫 НАСТАВНИК — АРХИТЕКТОР И ТИМЛИД

**Зона дел:** общая архитектура игры, написание базового движка, настройка Gitea, код-ревью, слияние веток, помощь с кодом, контроль дедлайнов, координация команды

**Зона репозитория:** `main`, `index.html`, `style.css`, `game.js`, `README.md`, `SPRINTS.md`

**Инструменты:** VS Code, Gitea, Git, Chrome DevTools, Canvas API

**Взаимодействие:** все члены команды

**Сложность:** абсолютная

**Функции:**

```javascript
function initGame() {
  // тело: получить canvas, создать ctx, загрузить уровень, запустить цикл
}

function gameLoop() {
  // тело: requestAnimationFrame, очистить экран, update(), draw()
}

function checkAllCollisions() {
  // тело: мышь со стенами, мышь с котом, мышь с предметами
}

function mergePullRequest(branchName) {
  // тело: проверить код, принять PR, разрешить конфликты если есть
}

function helpStudent(studentName, problem) {
  // тело: открыть ветку ученика, найти ошибку, показать решение
}
```

---

## 🧲 МУРАД — ИНЖЕНЕР ФИЗИКИ

**Зона дел:** движение мыши, прыжки, гравитация, столкновения со стенами и предметами

**Зона репозитория:** `physics.js`

**Инструменты:** VS Code, JavaScript, Canvas, отладчик браузера

**Взаимодействие:** Денис (ловушки), Иван (стены), Матвей (помощь)

**Сложность:** высокая

**Функции:**

```javascript
function moveMouse(dx, dy) {
  // тело: проверить стену в (x+dx, y+dy), если нет — двигать
}

function applyGravity(character) {
  // тело: если нет платформы снизу — скорость падения +0.5 каждый кадр
}

function jump(character) {
  // тело: если character на земле — задать vy = -10
}

function checkWallCollision(x, y) {
  // тело: вернуть true если в карте уровня по (x,y) тайл стены
}

function checkPlatformCollision(character) {
  // тело: проверить тайл под ногами, если платформа — поставить character на неё
}

function applyOilSliding(character) {
  // тело: если character на масле — speed умножить на 2, заблокировать поворот на 60 кадров
}
```

---

## 💡 ДАМИР — ХУДОЖНИК ПО ОСВЕЩЕНИЮ

**Зона дел:** отрисовка спрайтов, освещение сцены, тени

**Зона репозитория:** `assets/sprites/`, `assets/lighting/`

**Инструменты:** Piskel, GIMP, Aseprite

**Взаимодействие:** Иван (размеры спрайтов), Максим (текстуры)

**Сложность:** средняя

**Функции:**

```javascript
function drawShadow(character) {
  // тело: нарисовать серый овал под ногами character
}

function setLevelLighting(levelNumber) {
  // тело: если уровень 2 — затемнить экран, если 3 — нормальный свет
}

function drawDarknessOverlay(mouseX, mouseY) {
  // тело: залить экран чёрным, вырезать круг радиусом 100px вокруг мыши
}

function drawLightSource(x, y, radius) {
  // тело: нарисовать жёлтый полупрозрачный круг
}
```

---

## 🥚 ТИМУР — ГЕЙМ-ДИЗАЙНЕР ПО ПАСХАЛКАМ

**Зона дел:** секретные комбинации, скрытые уровни, неожиданные события

**Зона репозитория:** `scripts/eastereggs.js`

**Инструменты:** VS Code, JavaScript

**Взаимодействие:** Миша (пасхалки), Герман (тексты)

**Сложность:** низкая

**Функции:**

```javascript
function checkSecretCode(keysArray) {
  // тело: хранить 5 последних клавиш, сравнить с "ikode"
}

function activateSecretLevel() {
  // тело: загрузить скрытую карту, показать надпись
}

function checkThousandSteps(stepsCount) {
  // тело: если steps > 1000 — показать «Ты чемпион» на 3 секунды
}

function changeCatColor(cat) {
  // тело: задать случайный цвет коту на 5 секунд
}

function checkConsoleCommand(command) {
  // тело: если в консоли ввели "scitter.secret" — открыть режим бога
}
```

---

## 🧠 ОЛЕГ — ИНЖЕНЕР ЛОГИКИ

**Зона дел:** проектирование механик, блок-схемы, псевдокод, алгоритмы

**Зона репозитория:** `docs/logic/`, `cat.js`, `dog.js`

**Инструменты:** draw.io, VS Code, бумага и ручка

**Взаимодействие:** Наставник (архитектура), Мурад (физика), Иван (уровни)

**Сложность:** высокая

**Функции:**

```javascript
function catUpdate(cat, mouse) {
  // тело: switch(cat.state) — patrol/chase/search/frozen
}

function catPatrol(cat) {
  // тело: идти к patrolPoints[currentIndex], если пришёл — currentIndex++
}

function catChase(cat, mouse) {
  // тело: двигать кота к мыши, скорость ×1.5
}

function catSearch(cat) {
  // тело: уменьшить searchTimer, если 0 — state = 'patrol'
}

function dogWander(dog) {
  // тело: каждые 120 кадров задать случайное направление
}

function dogProtect(dog, cat, mouse) {
  // тело: если кот ближе 200px к мыши — бежать к коту, заморозить
}

function feedDog(dog, mouse) {
  // тело: если у мыши кость — dog.fullness +25, кость удалить
}

function drawStateDiagram() {
  // тело: нарисовать схему patrol → chase → search → patrol
}
```

---

## 📖 ГЕРМАН — СЦЕНАРИСТ И САУНД-ДИЗАЙНЕР

**Зона дел:** сценарий, диалоги, подсказки, музыка и звуки

**Зона репозитория:** `assets/sounds/`, `scripts/dialogs.js`

**Инструменты:** Audacity, VS Code

**Взаимодействие:** Тимур (тексты пасхалок), Миша (фразы ачивок), Аврора (фразы)

**Сложность:** низкая

**Функции:**

```javascript
function loadAllSounds() {
  // тело: создать объекты Audio для cheese.mp3, meow.mp3, bark.mp3, victory.mp3, gameover.mp3
}

function playSound(soundName) {
  // тело: найти звук по имени, проиграть с громкостью 0.5
}

function playStepSound() {
  // тело: проиграть step.mp3, громкость 0.2
}

function showIntroDialogue() {
  // тело: нарисовать текст внизу экрана, переключать по клику
}

function showCatPhrase(situation) {
  // тело: если победа — «Мяу! Ты победил!», если поражение — «Мяу! Попался!»
}

function showHint(text) {
  // тело: нарисовать подсказку вверху экрана на 3 секунды
}
```

---

## 🗺️ ИВАН — ДИЗАЙНЕР УРОВНЕЙ И СПРАЙТОВ

**Зона дел:** создание уровней, расположение объектов, спрайты персонажей

**Зона репозитория:** `levels/`, `assets/sprites/`

**Инструменты:** VS Code, Tiled, JSON

**Взаимодействие:** все члены команды

**Сложность:** очень высокая

**Функции:**

```javascript
function createLevel1() {
  // тело: вернуть массив 50x50, стены по краям, комнаты внутри, 5 сыров, 1 лунка
}

function createLevel2() {
  // тело: вернуть массив 60x60, открытое пространство, дороги, 8 сыров
}

function createLevel3() {
  // тело: вернуть массив 50x50, круглая арена с водой, 6 сыров, 3 кости
}

function drawSprite(character, state) {
  // тело: в зависимости от state нарисовать нужный спрайт из массива
}

function animateSprite(character) {
  // тело: frameCounter++, выбрать кадр из spriteSheet
}

function placeObjectsOnMap(level, objects) {
  // тело: расставить объекты на свободные тайлы карты
}
```

---

## 🏠 АРТЁМ — ХУДОЖНИК ОКРУЖЕНИЯ

**Зона дел:** декор: заборы, таблички, ящики, сундуки, фонари, кусты

**Зона репозитория:** `assets/objects/`, `assets/decorations/`

**Инструменты:** Piskel, GIMP, Aseprite

**Взаимодействие:** Иван (размещение), Олег (стиль)

**Сложность:** средняя

**Функции:**

```javascript
function drawBox(x, y, type) {
  // тело: нарисовать квадрат с текстурой ящика, type от 1 до 5
}

function drawSign(x, y, text) {
  // тело: нарисовать палку и табличку, написать text
}

function drawChest(x, y) {
  // тело: нарисовать прямоугольник с замком, если открыт — показать содержимое
}

function drawLamp(x, y) {
  // тело: нарисовать столб и светящийся жёлтый круг
}

function drawBush(x, y) {
  // тело: нарисовать зелёный круг с неровным краем
}

function drawFence(x, y, length) {
  // тело: нарисовать length секций забора
}
```

---

## ☁️ МАКСИМ — ХУДОЖНИК ПО ТЕКСТУРАМ И ФОНАМ

**Зона дел:** фоны, небо, земля, стены, пол, тайлы

**Зона репозитория:** `assets/backgrounds/`, `assets/tiles/`

**Инструменты:** Piskel, GIMP, Aseprite

**Взаимодействие:** Иван (размеры тайлов), Дамир (освещение)

**Сложность:** высокая

**Функции:**

```javascript
function loadTileSet(levelNumber) {
  // тело: загрузить картинки тайлов для уровня (земля, стена, вода, трава)
}

function drawBackground(levelNumber) {
  // тело: залить фон цветом или картинкой неба для уровня
}

function drawTile(tileType, x, y) {
  // тело: нарисовать квадрат 40x40 с текстурой tileType
}

function drawFloor(startX, startY, width, height) {
  // тело: заполнить прямоугольник тайлами пола
}

function drawWall(startX, startY, width, height) {
  // тело: заполнить прямоугольник тайлами стен
}
```

---

## 🕵️ МИША — ГЕЙМ-ДИЗАЙНЕР ПО ДОСТИЖЕНИЯМ

**Зона дел:** система ачивок, сохранение рекордов, скрытые сообщения

**Зона репозитория:** `scripts/achievements.js`, `storage.js`

**Инструменты:** VS Code, JavaScript, LocalStorage API

**Взаимодействие:** Тимур (пасхалки), Герман (тексты), Наставник (архитектура)

**Сложность:** средняя

**Функции:**

```javascript
function checkFirstCheese(collected) {
  // тело: если collected > 0 — выдать ачивку «Первый сыр»
}

function checkTenCheese(collected) {
  // тело: если collected >= 10 — выдать ачивку «Сыроман»
}

function checkSpeedRun(time) {
  // тело: если time < 30 — выдать ачивку «Спидранер»
}

function checkNoFear(fearLevel) {
  // тело: если fearLevel === 0 в конце уровня — выдать «Храбрец»
}

function checkAllBones(collected) {
  // тело: если собраны все кости на уровне — выдать «Косточка»
}

function saveAchievements(list) {
  // тело: localStorage.setItem('achievements', JSON.stringify(list))
}

function loadAchievements() {
  // тело: вернуть JSON.parse(localStorage.getItem('achievements'))
}

function showSecretMessage() {
  // тело: если все 10 ачивок получены — показать скрытый текст
}
```

---

## 🖥️ ДЕНИС — ДИЗАЙНЕР ЛОВУШЕК

**Зона дел:** масло, шипы, исчезающие платформы, движущиеся шипы

**Зона репозитория:** `scripts/obstacles.js`, `traps/`

**Инструменты:** VS Code, JavaScript, Tiled

**Взаимодействие:** Мурад (физика), Иван (размещение), Олег (архитектура)

**Сложность:** высокая

**Функции:**

```javascript
function createOilSlick(x, y) {
  // тело: задать координаты, размер 80x80, эффект — скольжение
}

function applyOilEffect(character) {
  // тело: speed ×2, блокировать поворот на 60 кадров
}

function createSpikes(x, y) {
  // тело: задать координаты, размер 40x40, при касании — смерть
}

function checkSpikeDamage(character) {
  // тело: если character на шипах — character.alive = false
}

function createDisappearingPlatform(x, y) {
  // тело: задать координаты, timer = 180, когда 0 — исчезает
}

function updatePlatform(platform) {
  // тело: platform.timer--, если 0 — platform.visible = false
}

function createMovingSpikes(x, y, dx, dy) {
  // тело: шипы которые двигаются по маршруту туда-обратно
}
```

---

## 👧 АВРОРА — ТЕСТИРОВЩИК И ХУДОЖНИК АЧИВОК

**Зона дел:** рисунки ачивок, поиск багов, отчёты, проверка механик

**Зона репозитория:** `assets/achievements/`, `issues/`

**Инструменты:** Piskel, GitHub Issues, браузер, DevTools

**Взаимодействие:** Наставник (отчёты), Герман (фразы), все (тестирование)

**Сложность:** низкая

**Функции:**

```javascript
function drawAchievementBadge(achievement, x, y) {
  // тело: нарисовать круг с иконкой (сыр, часы, щит, кость, звезда)
}

function drawAchievementPopup(name) {
  // тело: нарисовать плашку «Получено: name», показать на 3 секунды
}

function drawAllAchievements(list) {
  // тело: нарисовать сетку значков, полученные — цветные, недоступные — серые
}

function runTestChecklist() {
  // тело: проверить движение, сбор сыра, кота, лунку, ловушки, звуки
}

function reportBug(description, steps) {
  // тело: записать баг в массив, вывести в консоль красным
}

function testOnMobile() {
  // тело: проверить что кнопки и текст видны на маленьком экране
}
```

---

## 👦 МАТВЕЙ — UI/UX-ДИЗАЙНЕР И ПОМОЩНИК ФИЗИКА

**Зона дел:** интерфейс, кнопки, меню, шкалы, помощь с физикой

**Зона репозитория:** `style.css`, `ui/`, `physics.js` (помощь)

**Инструменты:** VS Code, Figma, Chrome DevTools, JavaScript

**Взаимодействие:** Наставник (дизайн), Мурад (физика), Аврора (тестирование)

**Сложность:** средняя

**Функции:**

```javascript
function drawSpeedIndicator(mouse) {
  // тело: нарисовать число над мышью — текущая скорость
}

function drawFearBar(mouse) {
  // тело: полоска шириной 50px, зелёный→жёлтый→красный, зависит от mouse.fear
}

function drawRestartButton() {
  // тело: прямоугольник «Начать заново», проверить клик по нему
}

function drawMainMenu() {
  // тело: заголовок ASCII-артом, кнопки «Играть», «Достижения», «Выход»
}

function drawLevelIntro(levelNumber) {
  // тело: крупно номер уровня, название, «Нажми любую клавишу»
}

function drawGodModeIndicator() {
  // тело: если режим бога включен — надпись «GOD MODE» в углу
}

function boostSpeed(character, multiplier) {
  // тело: сохранить normalSpeed, умножить на multiplier, вернуть через 180 кадров
}

function slowDown(character, multiplier) {
  // тело: сохранить normalSpeed, умножить на multiplier, вернуть через 120 кадров
}

function applyDeltaTime(deltaTime) {
  // тело: умножить все скорости на deltaTime для плавности
}
---

Готово. У каждого есть зона ответственности, инструменты, взаимодействие и заготовки функций. Что дальше?
