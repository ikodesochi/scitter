// ui/splash.js
// Заставка входа в игру — кот с красными глазами, мышь с жёлтыми

export function showSplash(callback) {
    const overlay = document.createElement('div');
    overlay.id = 'splash';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const pre = document.createElement('pre');
    pre.style.cssText = 'color: #888; font-size: 11px; line-height: 1.2; text-align: center;';
    overlay.appendChild(pre);
    document.body.appendChild(overlay);
    
    // Кадры: кот с красными глазами, мышь с жёлтыми
    const frames = [
        {
            cat: ` _._     _,-'""\`-._\n(,-.\`._,'(       |\\\`-/|\n    \`-.-' \\ )-\`( , <span style="color:#f00">o o</span>)\n          \`-    \\\`_\"'-\``,
            mouse: `              (\\_/)\n      .-\"\"-.-.-' <span style="color:#ff0">o o</span>\n     /  \\      _.--'\n    (\\  /_---\\\\_\\_\n     \`'-.\n       ,__)`
        },
        {
            cat: ` _._     _,-'""\`-._\n(,-.\`._,'(       |\\\`-/|\n    \`-.-' \\ )-\`( , <span style="color:#f00">> <</span>)\n          \`-    \\\`_\"'-\``,
            mouse: `              (\\_/)\n      .-\"\"-.-.-' <span style="color:#ff0">O o</span>\n     /  \\      _.--'\n    (\\  /_---\\\\_\\_\n     \`'-.\n       ,__)`
        },
        {
            cat: ` _._     _,-'""\`-._\n(,-.\`._,'(       |\\\`-/|\n    \`-.-' \\ )-\`( , <span style="color:#f00"># #</span>)\n          \`-    \\\`_\"'-\``,
            mouse: `              (\\_/)\n      .-\"\"-.-.-' <span style="color:#ff0">@ @</span>\n     /  \\      _.--'\n    (\\  /_---\\\\_\\_\n     \`'-.\n       ,__)`
        }
    ];
    
    const logo = 
        '   ███████╗ ██╗  ██╗ ██╗ ████████╗ ████████╗ ███████╗ ██████╗ \n' +
        '   ██╔════╝ ██║ ██╔╝ ██║ ╚══██╔══╝ ╚══██╔══╝ ██╔════╝ ██╔══██╗\n' +
        '   ███████╗ ██████╔╝ ██║    ██║       ██║    █████╗   ██████╔╝\n' +
        '   ╚════██║ ██╔═██╗ ██║    ██║       ██║    ██╔══╝   ██╔══██╗\n' +
        '   ███████║ ██║  ██╗██║    ██║       ██║    ███████╗ ██║  ██║\n' +
        '   ╚══════╝ ╚═╝  ╚═╝╚═╝    ╚═╝       ╚═╝    ╚══════╝ ╚═╝  ╚═╝';
    
    let frameIndex = 0;
    let animationTimer = null;
    let blinkVisible = true;
    
    function animate() {
        frameIndex = (frameIndex + 1) % frames.length;
        blinkVisible = !blinkVisible;
        
        const blink = blinkVisible ? 'Press any key to start...' : '                           ';
        const f = frames[frameIndex];
        
        pre.innerHTML = 
            f.cat + '\n' +
            '          vs\n' +
            f.mouse + '\n\n' +
            logo + '\n\n' +
            '          [WASD] move  [E] shop  [ESC] menu\n\n' +
            '        ' + blink;
        
        animationTimer = setTimeout(animate, 600);
    }
    
    animate();
    
    const start = () => {
        clearTimeout(animationTimer);
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        setTimeout(() => { overlay.remove(); callback(); }, 300);
        window.removeEventListener('keydown', start);
        window.removeEventListener('click', start);
    };
    
    window.addEventListener('keydown', start);
    window.addEventListener('click', start);
}