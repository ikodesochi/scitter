// core/assets.js
export function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn(`Не загрузилось: ${src}`);
            resolve(null);
        };
        img.src = src;
    });
}