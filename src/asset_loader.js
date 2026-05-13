// core/asset_loader.js
// Заглушки для будущих ассетов

// Заглушка-изображение (серый квадрат с текстом)
export function createPlaceholder(text, width, height, color = "#444") {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.floor(height/4)}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(text, width/2, height/2);
    
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

// Все ассеты-заглушки
export function loadAllAssets() {
    const images = {};
    const sounds = {};
    
    // Спрайты-заглушки
    images.cat = createPlaceholder("🐱", 32, 32, "#666");
    images.mouse = createPlaceholder("🐭", 28, 28, "#888");
    images.dog = createPlaceholder("🐕", 32, 32, "#8B6914");
    images.cheese = createPlaceholder("🧀", 20, 20, "#ccaa44");
    images.bone = createPlaceholder("🦴", 16, 16, "#ddbb88");
    
    // При попытке загрузить реальные файлы — не падаем
    try {
        // Здесь можно добавить загрузку реальных файлов когда они появятся
    } catch (e) {
        console.log("Ассеты не найдены, используем заглушки");
    }
    
    console.log("✅ Ассеты-заглушки созданы");
    return { images, sounds };
}