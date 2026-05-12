// core/asset_loader.js — загрузка всех картинок и звуков

/**
 * Загружает одно изображение и возвращает Promise
 * @param {string} src - путь к картинке
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn(`⚠️ Не удалось загрузить: ${src}`);
            reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
    });
}

/**
 * Загружает несколько изображений параллельно
 * @param {Object} imagesMap - объект { имя: "путь/к/файлу.png", ... }
 * @returns {Promise<Object>} - объект { имя: Image, ... }
 */
export async function loadImages(imagesMap) {
    const entries = Object.entries(imagesMap);
    const results = await Promise.all(
        entries.map(([key, path]) => loadImage(path).then(img => [key, img]))
    );
    return Object.fromEntries(results);
}

/**
 * Загружает звуковой файл (Web Audio API или простой Audio)
 * @param {string} src - путь к звуку
 * @returns {Promise<HTMLAudioElement>}
 */
export function loadSound(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
        audio.src = src;
    });
}

/**
 * Загружает несколько звуков параллельно
 * @param {Object} soundsMap - объект { имя: "путь/к/звуку.mp3", ... }
 * @returns {Promise<Object>} - объект { имя: Audio, ... }
 */
export async function loadSounds(soundsMap) {
    const entries = Object.entries(soundsMap);
    const results = await Promise.all(
        entries.map(([key, path]) => loadSound(path).then(audio => [key, audio]))
    );
    return Object.fromEntries(results);
}

/**
 * Групповая загрузка всех ассетов игры
 * @returns {Promise<Object>} - объект со всеми картинками и звуками
 */
export async function loadAllAssets() {
    const images = await loadImages({
        cat: "../assets/sprites/cat.jpg",
        dogSleep: "../assets/sprites/dog_sleep.png",
        dogBark: "../assets/sprites/dog_bark.png",
        mouse: "../assets/sprites/mouse.png"
    });

    const sounds = await loadSounds({
        meow: "../assets/sounds/meow.mp3",
        bark: "../assets/sounds/bark.mp3",
        collect: "../assets/sounds/collect.mp3"
    }).catch(err => {
        console.warn("Звуки не загружены, игра будет без звука", err);
        return {};
    });

    return { images, sounds };
}