// ui/levelIntro.js
// Заставки уровней с анимированным котом и мышью
// Глаза кота и мыши подсвечены цветом

const levelThemes = [
    {
        name: 'UNDERGROUND',
        sub: 'The Maze Begins',
        catEyes: 'o o', catColor: '#ff0',
        mouseEyes: 'o o', mouseColor: '#fff',
        decor: '┌──┐  ┌──┐  ┌──┐',
        color: '#aaa'
    },
    {
        name: 'DARKNESS',
        sub: 'Fear the Unknown',
        catEyes: '> <', catColor: '#ff6600',
        mouseEyes: 'O o', mouseColor: '#ffff00',
        decor: '· · · · · · · ·',
        color: '#555'
    },
    {
        name: 'STREET',
        sub: 'City Chase',
        catEyes: '> <', catColor: '#ff4400',
        mouseEyes: 'O o', mouseColor: '#ffff00',
        decor: '┌────┐  ┌────┐',
        color: '#aaa'
    },
    {
        name: 'FRIENDSHIP',
        sub: 'Protect the Pack',
        catEyes: '> <', catColor: '#ff4400',
        mouseEyes: 'o o', mouseColor: '#fff',
        decor: '  <3   WOOF!',
        color: '#aaa'
    },
    {
        name: 'TRAPS',
        sub: 'Danger Everywhere',
        catEyes: '# #', catColor: '#ff0000',
        mouseEyes: '@ @', mouseColor: '#ffff00',
        decor: '▲ ▲ ▲ ▲ ▲ ▲',
        color: '#a44'
    },
    {
        name: 'FINAL BOSS',
        sub: 'Face Your Fear',
        catEyes: '# #', catColor: '#ff0000',
        mouseEyes: '@ @', mouseColor: '#ffff00',
        decor: '█▓█▓█▓█▓█▓█▓',
        color: '#f44'
    }
];

// Генерация ASCII с цветными глазами
function buildFrame(catEyes, catColor, mouseEyes, mouseColor, decor) {
    return `
                        _._     _,-'\`\`\`-._
                       (,-.\`._,'(       |\\\`-/|
                           \`-.-' \\ )-\`( , <span style="color:${catColor}">${catEyes}</span>)
                                 \`-    \\\`_\`\"'-\`
                      
                              (\\_/)
                      .-\"\"-.-.-' <span style="color:${mouseColor}">${mouseEyes}</span>
                     /  \\      _.--'
                    (\\  /_---\\\\_\\_
                     \`'-.
                       ,__)
                      
                      ${decor}`;
}

export function showLevelIntro(levelIndex, callback) {
    if (levelIndex >= levelThemes.length) { callback(); return; }
    
    const theme = levelThemes[levelIndex];
    let frame = 0;
    
    // Последовательность моргания
    const catSeq = [theme.catEyes, theme.catEyes.replace(' ', ''), theme.catEyes];
    const mouseSeq = [theme.mouseEyes, theme.mouseEyes.replace(' ', ''), theme.mouseEyes];
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9998;
        transition: opacity 0.3s;
    `;
    
    const pre = document.createElement('pre');
    pre.style.cssText = `color: ${theme.color}; font-size: 9px; line-height: 1.05; text-align: center; margin: 0;`;
    overlay.appendChild(pre);
    
    const title = document.createElement('div');
    title.style.cssText = `color: ${theme.color}; font-size: 28px; font-weight: bold; margin-top: 15px; font-family: monospace; letter-spacing: 4px;`;
    title.textContent = theme.name;
    overlay.appendChild(title);
    
    const sub = document.createElement('div');
    sub.style.cssText = `color: #888; font-size: 14px; margin-top: 5px; font-family: monospace; letter-spacing: 2px;`;
    sub.textContent = theme.sub;
    overlay.appendChild(sub);
    
    const levelText = document.createElement('div');
    levelText.style.cssText = `color: #666; font-size: 11px; margin-top: 5px; font-family: monospace;`;
    levelText.textContent = `Level ${levelIndex + 1} / ${levelThemes.length}`;
    overlay.appendChild(levelText);
    
    const skipText = document.createElement('div');
    skipText.style.cssText = `color: #444; font-size: 10px; margin-top: 10px; font-family: monospace;`;
    skipText.textContent = 'press any key or click to skip';
    overlay.appendChild(skipText);
    
    document.body.appendChild(overlay);
    
    const animTimer = setInterval(() => {
        frame = (frame + 1) % catSeq.length;
        pre.innerHTML = buildFrame(catSeq[frame], theme.catColor, mouseSeq[frame], theme.mouseColor, theme.decor);
    }, 500);
    
    const timeout = setTimeout(() => finish(), 2500);
    
    function finish() {
        clearInterval(animTimer);
        clearTimeout(timeout);
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.remove(); callback(); }, 300);
        window.removeEventListener('keydown', skip);
        window.removeEventListener('click', skip);
    }
    
    function skip() { finish(); }
    
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    
    pre.innerHTML = buildFrame(catSeq[0], theme.catColor, mouseSeq[0], theme.mouseColor, theme.decor);
}