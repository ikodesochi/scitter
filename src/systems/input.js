// systems/input.js
export const keys = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
};

export function initInput() {
    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
    });
    return keys;
}