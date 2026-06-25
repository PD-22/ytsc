let state = null;
let holding = false;
let preSpeed = 1;

function activate() {
    state = initState();
    if (!state) return void console.log("Shortcut activation failed");
    addActionListeners();
}

activate();

function shouldSpeedUpOnEnter(element) {
    if (!element) return false;
    
    const tag = element.tagName?.toLowerCase();
    const role = element.getAttribute('role');
    const isContentEditable = element.isContentEditable;
    
    if (tag === 'input' || 
        tag === 'textarea' || 
        tag === 'select' || 
        tag === 'button' ||
        isContentEditable ||
        role === 'button' ||
        role === 'link' ||
        role === 'textbox' ||
        role === 'searchbox' ||
        role === 'menuitem' ||
        role === 'tab') {
        return false;
    }
    
    return true;
}

document.addEventListener('keydown', event => {
    if (event.code === 'Escape') {
        if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
        }
        return;
    }
    
    if (event.code !== 'Enter' || holding) return;

    if (!shouldSpeedUpOnEnter(document.activeElement)) return;

    console.log('Holding');
    document.querySelector('button.ytp-skip-ad-button')?.focus();
    document.querySelector('#dismiss-button')?.click();

    const video = document.querySelector('video');
    
    preSpeed = video.playbackRate;
    
    video.play();
    video.playbackRate = 8;
    alert('▶▶', undefined, 'alert-right');
    holding = true;
});

document.addEventListener('keyup', event => {
    if (event.code !== 'Enter' || !holding) return;

    console.log('Released');

    const video = document.querySelector('video');
    
    video.playbackRate = preSpeed;
    
    clearAlerts();
    holding = false;
});

document.addEventListener('yt-navigate-finish', () => {
    removeActionListeners();
    activate();
});
