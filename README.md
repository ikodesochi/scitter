# Scitter

**Добро пожаловать в команду юных разработчиков iKODe!**

Ты — часть команды, которая создаёт игру **«Scitter»** с нуля. Мы используем настоящие инструменты разработки: **Git, GitHub, VS Code и JavaScript**.

Твоя задача — внести свой вклад в одну из зон ответственности. Всё, что ты сделаешь, попадёт в финальную версию игры. В конце проекта ты сможешь показать игру друзьям и родителям — и сказать: **«Я это сделал!»**

---

## 📖 Легенда игры

Ты — мышка **Pixel**. Кот **Nyx** охотится за тобой в подземном бункере. Твоя задача — убегать, собирать бонусы, избегать ловушек и держаться как можно дольше. С каждым уровнем кот становится быстрее, препятствий — больше.

Твоя команда управляет каждым элементом игры: персонажами, текстурами, предметами, уровнями, препятствиями и даже пасхалками.

---

## 🧭 ЧТО ТАКОЕ РЕПОЗИТОРИЙ?

Это место, где хранится код нашей игры. Репозиторий — как общая папка, в которую каждый из вас добавляет свою часть.

- **Основная (main) ветка** — стабильная версия игры. Здесь код, который точно работает.
- **Твоя личная ветка** — место для экспериментов. Меняй, пробуй, ошибайся. Ничего не сломается.
- **Pull Request (PR)** — твоя заявка на добавление своего кода в основную игру. Я (преподаватель) проверяю и сливаю изменения.

---

## 🗂️ СТРУКТУРА ПРОЕКТА SKITTER

Skitter/

    index.html
    style.css
    README.md

    src/

        game.js
        physics.js
        storage.js
        messages.json

        scripts/

            eastereggs.js
            dialogs.js
            achievements.js
            obstacles.js

        traps/

            oil_slick.js
            spikes.js
            disappearing_platform.js

        levels/

            level1.json
            level2.json
            level3.json

        characters/

            character_data.json

        ui/

            main_menu.html
            pause_menu.html
            game_over.html

    assets/

        sprites/

            cat_idle.png
            cat_run.png
            cat_attack.png
            mouse_idle.png
            mouse_run.png
            mouse_scared.png

        lighting/

            shadows.png

        sounds/

            meow.wav
            cheese.wav
            victory.wav
            gameover.wav

        backgrounds/

            level1_sky.png
            level1_ground.png
            level2_sky.png
            level2_ground.png

        tiles/

            grass.png
            stone.png
            wood.png

        objects/

            chest.png
            sign.png
            crate.png

        decorations/

            tree.png
            bush.png
            lantern.png

    docs/

        GLOSSARY.md
        CODESTYLE.md
        SPRINTS.md
        ROADMAP.md

        logic/

            cat_movement.drawio
            cheese_collection.drawio
            lure_logic.drawio

    issues/

        bug_reports.md

    .github/

        pull_request_template.md
---

## 🛠️ Как начать работать (пошагово)

### 1. Скачай проект к себе на компьютер

- Открой **VS Code** или любой редактор кода.
- Открой терминал (Ctrl + `) и напиши:

```bash
git clone https://github.com/твой-логин/termix-cat-and-mouse.git
cd termix-cat-and-mouse
```

### 2. Создай свою ветку

Напиши в терминале:

```bash
git checkout -b feature/твоя_роль
```

Примеры: feature/characters, feature/levels, feature/easter-eggs.

### 3. Открой игру в браузере

· Если у тебя есть расширение Live Server в VS Code → нажми правой кнопкой на index.html → Open with Live Server.
· Или просто открой файл index.html двойным кликом.

### 4. Начни кодить

· Все изменения делай в своей ветке.
· Комментируй сложные места (чтобы я понял).
· Проверяй, что игра не сломалась.

### 5. Сохрани изменения (коммит)

В терминале:

```bash
git add .
git commit -m "коротко опиши, что сделал"
```

Пример: "Добавил спрайт кота с анимацией бега"

### 6. Отправь код в GitHub

```bash
git push origin feature/твоя_роль
```

### 7. Создай Pull Request (PR)

· Зайди в репозиторий на GitHub.
· Нажми Pull requests → New pull request.
· Выбери свою ветку → base: main.
· Напиши, что сделал (можно на русском).
· Нажми Create pull request.

### 8. Жди проверки

Я посмотрю код, оставлю комментарии (если нужно). Если всё ок — я солью изменения в main. Твоя работа попадёт в игру!

---

## 📌 Правила разработки (чтобы код работал у всех)

· Не меняй game.js глобально — только добавляй свои функции и вызывай их там, где написано // TODO.
· Спрайты и картинки клади в правильные папки (sprites/, textures/, items/).
· Названия файлов пиши латиницей, без пробелов.
· Коммиты делай часто, но по делу.
· Не удаляй чужой код. Если нужно изменить — спроси в чате.

---

## 🧪 Пример: как добавить свой предмет (сыр)

```javascript
// 1. Добавь картинку сыра в папку assets/items/

// 2. В скрипте items.js (или в своём) напиши:
const cheese = { x: 300, y: 200, width: 20, height: 20, collected: false };

function drawCheese() {
    if (!cheese.collected) {
        ctx.drawImage(cheeseImg, cheese.x, cheese.y, cheese.width, cheese.height);
    }
}

function collectCheese() {
    // проверка столкновения мыши с сыром
    if (mouse.x < cheese.x + cheese.width && ... ) {
        cheese.collected = true;
        score += 50;
    }
}

// 3. Вызови функции в игровом цикле game.js
```

По такому же принципу ты добавишь ловушки, препятствия, пасхалки и анимации.

---

## ❓ Частые вопросы

Что делать, если я ошибся в коде и игра сломалась?

Ничего страшного. Ты работаешь в своей ветке, main не пострадала. Можешь откатиться к последнему сохранению:

```bash
git checkout .  # откатит все изменения в текущей папке
```

Как получить последние изменения из main?

```bash
git checkout main
git pull origin main
git checkout feature/твоя_роль
git merge main
```

Можно ли добавить свою идею, которой нет в списке?

Да, конечно. Обсуди это в командном чате. Лучшие идеи мы добавим в игру!

---

## 🏆 Что будет в конце?

### Полностью работающая игра в браузере.
### Твоё имя в истории коммитов GitHub (портфолио для будущего).
### Возможность показать игру родителям и друзьям.

---

## 🎬 Поехали!

Создай свою ветку, открой index.html и начинай творить. Если застрял — пиши в чат или зови на помощь. 

```bash
git checkout -b feature/твоя_роль
```
