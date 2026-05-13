// systems/renderer.js
import { W, H } from '../core/constants.js';
import { getWorldMap, getMouse, getCat, getDog, getExtraCats, getCockroach, getCheeses, getBones, getHole, getCheeseCount, getBoneCount, getTotalCheeseGoal, getTotalBoneGoal, getCurrentLevelInfo } from './levelManager.js';
import { getCamera } from '../world/camera.js';
import { drawWorld } from '../world/worldRenderer.js';
import { drawOilSlicks } from '../traps/oil_slick.js';
import { drawSpikes } from '../traps/spikes.js';
import { drawPlatforms } from '../traps/disappearing_platform.js';
import { isFullVision } from './admin.js';

export function render(ctx) {
    const worldMap = getWorldMap();
    if (!worldMap) return;
    
    const camera = getCamera();
    const levelInfo = getCurrentLevelInfo();
    const mouse = getMouse();
    
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);
    
    // Передаём мышь для красной ауры страха
    drawWorld(ctx, camera, worldMap, levelInfo?.fearAura ? mouse : null);
    
    if (levelInfo?.darknessEnabled && !isFullVision()) {
        drawDarknessFog(ctx, camera, levelInfo);
    }
    
    drawItems(ctx, camera);
    drawHole(ctx, camera);
    
    if (levelInfo?.trapsEnabled) drawTraps(ctx, camera);
    
    drawCharacters(ctx, camera);
}

function drawDarknessFog(ctx, camera, levelInfo) {
    const mouse = getMouse();
    if (!mouse) return;
    
    const mx = mouse.x - camera.x + mouse.w / 2;
    const my = mouse.y - camera.y + mouse.h / 2;
    const baseRadius = levelInfo.visionRadius || 80;
    const bonus = mouse.getVisionBonus ? mouse.getVisionBonus() : 0;
    const radius = baseRadius + bonus;
    
    // Сначала заливаем ВЕСЬ экран чёрным
    ctx.fillStyle = "rgba(0, 0, 0, 0.97)";
    ctx.fillRect(0, 0, W, H);
    
    // Затем вырезаем круг света вокруг мыши
    const gradient = ctx.createRadialGradient(mx, my, radius * 0.15, mx, my, radius);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.4, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.7)");
    gradient.addColorStop(0.9, "rgba(0, 0, 0, 0.92)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.97)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Красное мерцание на финальном уровне
    if (levelInfo?.fearAura) {
        const time = Date.now() / 200;
        const fearRadius = radius * 1.1;
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.2 + Math.sin(time) * 0.15})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, fearRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawItems(ctx, camera) {
    const cheeses = getCheeses();
    if (cheeses) {
        for (let c of cheeses) {
            if (!c.collected) {
                const x = c.x - camera.x, y = c.y - camera.y;
                ctx.fillStyle = "rgba(0,0,0,0.4)";
                ctx.fillRect(x + 2, y + 2, c.w, c.h);
                ctx.fillStyle = "#ffcc00";
                ctx.fillRect(x, y, c.w, c.h);
                ctx.fillStyle = "#ffee66";
                ctx.fillRect(x + 3, y + 3, 8, 8);
                ctx.fillStyle = "#cc9900";
                ctx.fillRect(x + 5, y + 11, 4, 4);
                ctx.fillRect(x + 13, y + 6, 3, 3);
            }
        }
    }
    
    const bones = getBones();
    if (bones) {
        for (let b of bones) {
            if (!b.collected) {
                const x = b.x - camera.x, y = b.y - camera.y;
                ctx.fillStyle = "rgba(0,0,0,0.4)";
                ctx.fillRect(x + 2, y + 2, b.w, b.h);
                ctx.fillStyle = "#eeeeee";
                ctx.fillRect(x, y, b.w, b.h);
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x - 1, y - 4, 8, 8);
                ctx.fillRect(x + b.w - 7, y + b.h - 4, 8, 8);
            }
        }
    }
}

function drawHole(ctx, camera) {
    const hole = getHole();
    if (!hole || !hole.active) return;
    const x = hole.x - camera.x, y = hole.y - camera.y, size = hole.w;
    const cx = x + size / 2, cy = y + size / 2;
    
    const glow = ctx.createRadialGradient(cx, cy, size * 0.25, cx, cy, size * 0.65);
    glow.addColorStop(0, "rgba(180, 150, 20, 0.5)");
    glow.addColorStop(1, "rgba(180, 150, 20, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 12, y - 12, size + 24, size + 24);
    
    const holeGrad = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, size / 2 - 2);
    holeGrad.addColorStop(0, "#c8960c");
    holeGrad.addColorStop(0.4, "#8a7000");
    holeGrad.addColorStop(1, "#3a2a00");
    ctx.fillStyle = holeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawTraps(ctx, camera) {
    drawOilSlicks(ctx, (wx, wy) => ({ x: wx - camera.x, y: wy - camera.y }));
    drawSpikes(ctx, camera);
    drawPlatforms(ctx, camera);
}

function drawCharacters(ctx, camera) {
    const levelInfo = getCurrentLevelInfo();
    
    const cockroach = getCockroach();
    if (cockroach) cockroach.draw(ctx, camera);
    
    const mouse = getMouse();
    if (mouse) mouse.draw(ctx, camera, getCheeseCount(), getBoneCount(), getTotalCheeseGoal(), getTotalBoneGoal());
    
    const cat = getCat();
    if (cat) cat.draw(ctx, camera, levelInfo);
    
    const extraCats = getExtraCats();
    if (extraCats) {
        for (const ec of extraCats) ec.draw(ctx, camera, levelInfo);
    }
    
    const dog = getDog();
    if (dog) dog.draw(ctx, camera, getBoneCount());
}