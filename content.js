let state = null;
console.log(`Press "${systemActions.enableShortcuts.key}" to activate video shortcuts`);
addSystemListeners();

let holding = false;
document.addEventListener('keydown', event => {
    if (event.code !== 'Enter') return;

    console.log('Holding');
    document.querySelector('button.ytp-skip-ad-button')?.focus();
    document.querySelector('#dismiss-button')?.click()

    const classList = document.activeElement.classList;
    if (!classList.contains('html5-video-player')) return;

    const video = document.querySelector('video');
    video.play();
    video.playbackRate = 8;
    video.volume = 0;
    alert('▶▶', undefined, 'alert-right');
    holding = true;
});

document.addEventListener('keyup', () => {
    if (!holding) return;

    console.log('Released');
    document.getElementsByClassName('html5-video-player')[0]?.focus();

    const video = document.querySelector('video');
    video.playbackRate = 1;
    video.volume = 1;
    clearAlerts();
    holding = false;
});
