// ui/splash.js
// Заставка при запуске игры — череп в ASCII

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
    pre.style.cssText = 'color: #444; font-size: 5px; line-height: 1; text-align: center;';
    pre.textContent = `
▊▉▌▏         ▏▊▃▏                  
                                                                 ▁ ▎▉▌▏     ▏▎▉▆█▎                  
                                                                 ▉▏▏ ▋▂▁▂▁▃▂▋▊▍▇█▍                  
                              ▋▋▌▌▉▍       ▎▎▃▆▅▉▍               ▊▌   ▎▁▉▃▋▊ ▏▊▇▆▎                  
                             ▋▎   ▏▂▍▊▏ ▏▌▌▋▂█▇▍▏▁               ▏▎    ▎▎▍▍▏  ▎█▆▎                  
                             ▁    ▎▁▃▃▏ ▏▎▌▉▇▅▉  ▂               ▎▌▌▊▂▃▊  ▌▃▄▉▂██▊                  
                             ▏▊▍▎▎▉▉▏ ▊▃▊  ▋▇▇▂▊▊▌               ▄▍▋▍▎▏▎▏▎▌▎▎▉▆██▋                  
                               ▏▊█▂▏  ▍▊▌  ▏▋█▃                  ▎▃▌▍▏▏ ▋▃▏ ▌▉▅▆▉                   
                              ▍▉▄▇▄▆▃▂▊▋▍▏ ▎▎▃▆                    ▁▉▁▉▉▌▍▄█▇▅▅▆▎                   
            ▏▍             ▏▏▎▏  ▉█▆▅▅▅▃▄▁▌▂█▅▌                    ▂▏▏▌▅████████▆▌                  
              ▏           ▎▌▏     ▊▇███████▇█▍                    ▏▌   ▏▍▊▁▃██████▁                 
               ▎         ▌▌   ▎▌ ▎▅█▌▋▇██████▇▍                   ▊     ▏▏▏ ▏▂█████▅▏               
               ▍        ▋▌    ▋▃ ▏▂█▅▍▏▄███████▉▏                ▏▃        ▏  ██████▅▏              
              ▋▍       ▏▁     ▎▃▆▄▂▉▂▂▊▆█████▃▄▃▍▏               ▏▂▎  ▎     ▏▃▆██████▂▏             
            ▏▉▎        ▍▊   ▏▌▍ ▊▇███▅▉▃█████▊ ▏▏▏                ▉▄▎▊▏▌▌  ▍▎▏▌▆██████▎             
           ▍▋▏         ▍▅▎    █▁▂████████████▋                  ▍ ▏▆▂▌▏ ▆▁▍▃▏▏▊██████▆▏             
           ▂           ▎▆▂▏  ▋██████████████▅                    ▊▌▃▇▍  ▃█▇▂  ▁██████▂              
         ▎▎▎            ▍█▇▆▆██████████████▅▎                    ▎▃▄█▂  ▂██▉ ▌▇█████▅▏              
          ▋▊▍▏▏      ▎▎▋▂████████████████▇▁▏                     ▎▍▁▃▍  ▉██▎  ▌▅█████▆▂▁▁▊▌▍        
      ▎▌▌▉▁▃▅▅▄▁▁▁▄▇▇▄▊▊▊▋▊▆█▁▂▉▄▇███▇████▇▃▅▆▆▆▉▋▋▌       ▎▌▌▂▃▂▆▇▆▂▃▉▃▄▇▇▃▁▄▁▄█████████▅▅▅▄▁▌▏    
                 ▏▍▍▍▏▏▏▏▏▏▎▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▎                 ▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▎           
`;
    
    overlay.appendChild(pre);
    
    // Название и подсказка
    const info = document.createElement('div');
    info.style.cssText = 'text-align: center; margin-top: 20px;';
    info.innerHTML = `
        <div style="color: #888; font-size: 28px; font-weight: bold; font-family: monospace; letter-spacing: 4px;">SKITTER</div>
        <div style="color: #666; font-size: 12px; margin-top: 10px; font-family: monospace;">Mouse vs Cat — Survival Maze</div>
        <div style="color: #444; font-size: 10px; margin-top: 15px; font-family: monospace;">press any key to start</div>
    `;
    overlay.appendChild(info);
    
    document.body.appendChild(overlay);
    
    // Мигание подсказки
    let blink = true;
    const blinkTimer = setInterval(() => {
        blink = !blink;
        info.children[2].style.opacity = blink ? '1' : '0';
    }, 500);
    
    const start = () => {
        clearInterval(blinkTimer);
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            overlay.remove();
            callback();
        }, 300);
        window.removeEventListener('keydown', start);
        window.removeEventListener('click', start);
    };
    
    window.addEventListener('keydown', start);
    window.addEventListener('click', start);
}