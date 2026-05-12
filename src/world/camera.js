// world/camera.js
import { WORLD_WIDTH, WORLD_HEIGHT, W, H } from '../core/constants.js';

let camera = { x: 0, y: 0 };

export function updateCamera(targetX, targetY) {
    camera.x = targetX - W / 2;
    camera.y = targetY - H / 2;
    
    // Ограничиваем камеру, чтобы не выходить за пределы мира
    camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH - W));
    camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT - H));
}

export function worldToScreen(worldX, worldY) {
    return {
        x: worldX - camera.x,
        y: worldY - camera.y
    };
}

export function screenToWorld(screenX, screenY) {
    return {
        x: screenX + camera.x,
        y: screenY + camera.y
    };
}

export function getCamera() {
    return { ...camera };
}