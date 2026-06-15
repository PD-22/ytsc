let state = null;
let holding = false;
let preSpeed = 1;

function activate() {
    state = initState();
    if (!state) return void console.log("Shortcut activation failed");
    addActionListeners();
}

activate();

document.addEventListener('keydown', event => {
    if (event.code !== 'Enter' || holding) return;

    const tag = document.activeElement?.tagName?.toLowerCase();
    const isEditable = document.activeElement?.isContentEditable;
    if (tag === 'input' || tag === 'textarea' || isEditable) return;

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
