let state = clearState();

run();

//#region run
function run() {
    console.log(`Press "${enableShortcuts.key}" to activate video shortcuts`);
    addSystemListeners();
}

function addSystemListeners() {
    document.addEventListener('keyup', systemListener);
}

function removeSystemListeners() {
    document.removeEventListener('keyup', systemListener);
}

function systemListener(event) {
    if (!eventMatches(event, enableShortcuts)) return;
    enableShortcuts.action();
}
//#endregion

//#region state
function initState() {
    const video = initVideo();
    return video ? { video, start: null, end: null } : clearState();
}

function clearState() {
    return null;
}

function initVideo() {
    const id = getUrlVideoId();
    const element = getVideoElement();
    const container = getVideoContainer();

    const success = [id, element, container].every(x => Boolean(x));
    return success ? { id, element, container } : clearVideo();

    function getVideoElement() {
        return document.querySelector('video.html5-main-video');
    }

    function getVideoContainer() {
        return getVideoElement()?.parentElement?.parentElement;
    }
}

function getUrlVideoId() {
    return new URLSearchParams(window.location.search).get('v');
}

function clearVideo() {
    return null;
}
//#endregion

function log(text, duration) {
    console.log(text);
    alert(text, duration);
}
