// ui/levelIntro.js
// Заставки уровней с анимированными ASCII-артами

const levelThemes = [
    {
        name: 'UNDERGROUND',
        sub: 'The Maze Begins',
        catEyes: 'o o', catColor: '#ff0',
        mouseEyes: 'o o', mouseColor: '#fff',
        decor: '┌──┐  ┌──┐  ┌──┐',
        color: '#aaa',
        type: 'cat'
    },
    {
        name: 'DARKNESS',
        sub: 'Fear the Unknown',
        catEyes: '> <', catColor: '#ff6600',
        mouseEyes: 'O o', mouseColor: '#ffff00',
        decor: '· · · · · · · ·',
        color: '#555',
        type: 'mouse'
    },
    {
        name: 'STREET',
        sub: 'City Chase',
        catEyes: '> <', catColor: '#ff4400',
        mouseEyes: 'O o', mouseColor: '#ffff00',
        decor: '┌────┐  ┌────┐',
        color: '#aaa',
        type: 'mouse'
    },
    {
        name: 'FRIENDSHIP',
        sub: 'Protect the Pack',
        catEyes: '> <', catColor: '#ff4400',
        mouseEyes: 'o o', mouseColor: '#fff',
        decor: '',
        color: '#aaa',
        type: 'dog'
    },
    {
        name: 'TRAPS',
        sub: 'Danger Everywhere',
        catEyes: '# #', catColor: '#ff0000',
        mouseEyes: '@ @', mouseColor: '#ffff00',
        decor: '▲ ▲ ▲ ▲ ▲ ▲',
        color: '#a44',
        type: 'mouse'
    },
    {
        name: 'FINAL BOSS',
        sub: 'Face Your Fear',
        catEyes: '# #', catColor: '#ff0000',
        mouseEyes: '@ @', mouseColor: '#ffff00',
        decor: '█▓█▓█▓█▓█▓█▓',
        color: '#f44',
        type: 'mouse'
    }
];

// Кадры анимации собаки (буквы меняются создавая движение)
const dogFrames = [
    // Кадр 1 — без сердца
    `ZXXZYYY                                               
                                             VGAAHAAFW       YVPPPUW               XZ               
                                             UDAAAAADW      RPU ZHBALX             HR               
                                              YODACPY   YURSMYMV AAAAP            MQH               
                                                ZQZ     WBJ      JBINCQ          PLSN               
                                ZVRSQOXMPRQ              WO Z ZUW XNBHVQQQQQQQQPPURQZ               
                                XL   ODGNNKN               QSSRJJHCIT           ZMU                 
                            WQQQOKZ   ZUZYUXPQWYV               TDS               PS                 
                          WOT   ZTPPPW  YRUXXSPS                F            TY  PS                 
                          NS  ZUYZYYZZOV XYTNUNU                VIUXS S    YSHX  PS                 
                          NS ZZYYVY   ZPJBNRRW                  EIBF DJOQQNDALZ UN                 
                         ZQJT    SN  YUPHKI                     ZF KL J      LBCO H                 
            YXTQQQQQQQQQQOMJMPPOLHGQQIKSRZX                     LOTGPZI     PEADPYJ                 
            TNPRRRRRRRRRSWY  PQSSRPVPRRSQ                       WWWNRRX     XWWORQY                 `,
    // Кадр 2 — сердце
    `ZXXZYYY                                               
                                             VGAAHAAFW       YVPPPUW               XZ               
                                             UDAAAAADW      RPU ZHBALX             HR               
                                              YODACPY   YURSMYMV AAAAP            MQH               
                                                ZQZ     WBJ      JBINCQ          PLSN               
                                ZVRSQOXMPRQ              WO Z ZUW XNBHVQQQQQQQQPPURQZ               
                                XL   ODGNNKN               QSSRJJHCIT           ZMU                 
                            WQQQOKZ   ZUZYUXPQWYV               TDS               PS                 
                          WOT   ZTPPPW  YRUXXSPS                F            TY  PS                 
                          NS  ZUYZYYZZOV XYTNUNU                VIUXS S    YSHX  PS                 
                          NS ZZYYVY   ZPJBNRRW                  EIBF DJOQQNDALZ UN                 
                         ZQJT    SN  YUPHKI                     ZF KL J      LBCO H                 
            YXTQQQQQQQQQQOMJMPPOLHGQQIKSRZX                     LOTGPZI     PEADPYJ                 
            TNPRRRRRRRRRSWY  PQSSRPVPRRSQ                       WWWNRRX     XWWORQY                 
                                                                           <3`,
    // Кадр 3 — два сердца
    `ZXXZYYY                                               
                                             VGAAHAAFW       YVPPPUW               XZ               
                                             UDAAAAADW      RPU ZHBALX             HR               
                                              YODACPY   YURSMYMV AAAAP            MQH               
                                                ZQZ     WBJ      JBINCQ          PLSN               
                                ZVRSQOXMPRQ              WO Z ZUW XNBHVQQQQQQQQPPURQZ               
                                XL   ODGNNKN               QSSRJJHCIT           ZMU                 
                            WQQQOKZ   ZUZYUXPQWYV               TDS               PS                 
                          WOT   ZTPPPW  YRUXXSPS                F            TY  PS                 
                          NS  ZUYZYYZZOV XYTNUNU                VIUXS S    YSHX  PS                 
                          NS ZZYYVY   ZPJBNRRW                  EIBF DJOQQNDALZ UN                 
                         ZQJT    SN  YUPHKI                     ZF KL J      LBCO H                 
            YXTQQQQQQQQQQOMJMPPOLHGQQIKSRZX                     LOTGPZI     PEADPYJ                 
            TNPRRRRRRRRRSWY  PQSSRPVPRRSQ                       WWWNRRX     XWWORQY                 
                                                                           <3<3`
];

function buildCatFrame(catEyes, catColor, decor) {
    return `
                        _._     _,-'\`\`\`-._
                       (,-.\`._,'(       |\\\`-/|
                           \`-.-' \\ )-\`( , <span style="color:${catColor}">${catEyes}</span>)
                                 \`-    \\\`_\`\"'-\`
                      
                      ${decor}`;
}

function buildMouseFrame(mouseEyes, mouseColor, decor) {
    return `
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
    const fontSize = theme.type === 'dog' ? '4px' : '9px';
    const lineHeight = theme.type === 'dog' ? '1' : '1.05';
    pre.style.cssText = `color: ${theme.color}; font-size: ${fontSize}; line-height: ${lineHeight}; text-align: center; margin: 0;`;
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
    
    const updateFrame = () => {
    if (theme.type === 'cat') {
        pre.innerHTML = buildCatFrame(catSeq[frame], theme.catColor, theme.decor);
    } else if (theme.type === 'dog') {
        let art = dogFrames[frame];
        // Подсветка сердца красным
        art = art.replace(/<3/g, '<span style="color:#f00">&lt;3</span>');
        pre.innerHTML = art;
    } else {
        pre.innerHTML = buildMouseFrame(mouseSeq[frame], theme.mouseColor, theme.decor);
    }
};
    
    const animTimer = setInterval(() => {
        if (theme.type === 'dog') {
            frame = (frame + 1) % dogFrames.length;
        } else {
            frame = (frame + 1) % catSeq.length;
        }
        updateFrame();
    }, theme.type === 'dog' ? 400 : 500);
    
    updateFrame();
    
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
}