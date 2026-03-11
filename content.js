let state = null;
let holding = false;
let preSpeed = 1;

console.log(`Press "${systemActions.enableShortcuts.key}" to activate video shortcuts`);
addSystemListeners();

if (localStorage.getItem('shortcutsEnabled') === 'true') 
    systemActions.enableShortcuts.action();

document.addEventListener('keydown', event => {
    if (event.code !== 'Enter' || holding) return;

    console.log('Holding');
    document.querySelector('button.ytp-skip-ad-button')?.focus();
    document.querySelector('#dismiss-button')?.click();

    const classList = document.activeElement.classList;
    if (!classList.contains('html5-video-player')) return;

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
    document.getElementsByClassName('html5-video-player')[0]?.focus();

    const video = document.querySelector('video');
    
    video.playbackRate = preSpeed; 
    
    clearAlerts();
    holding = false;
});