// systems/audio.js (заглушка — без реальных звуков)
export async function loadSounds() {
    console.log("Звуки отключены (заглушка)");
}

export function playCheese() { console.log("playCheese"); }
export function playMeow() { console.log("playMeow"); }
export function playBark() { console.log("playBark"); }
export function playVictory() { console.log("playVictory"); }
export function playGameOver() { console.log("playGameOver"); }
export function resumeAudio() {}