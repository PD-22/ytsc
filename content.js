let state = clearState();

class Action {
    constructor(name, key, action) {
        this.name = name;
        this.key = key;
        this.action = action;
    }
}

//#region Actions
const enableShortcuts = new Action('Enable shortcuts', '`', function () {
    state = initState();
    if (state) {
        removeSystemListeners();
        addActionListeners();
        log(formatActions(), 3000);
    } else {
        log("Shortcut activation failed");
    }
});

const disableShortcuts = new Action('Disable shortcuts', '`', function () {
    removeActionListeners();
    addSystemListeners();
    log("Shortcuts disabled", 3000);
    // clear the state at the end
    state = clearState();
});

const setStart = new Action('Set start', 'a', function () {
    const currentTime = state.video.element.currentTime;
    if (state.end != null && currentTime >= state.end) {
        log(`Cannot set start [${formatDuration(currentTime)}] after end [${formatDuration(state.end)}]`);
        return;
    }
    state.start = currentTime;
    log(`${this.name}: [${formatDuration(state.start)}]`);
});

const loadStart = new Action('Load start', 's', function () {
    if (state.start == null) return;
    state.video.element.currentTime = state.start;
    log(`${this.name}: [${formatDuration(state.start)}]`);
});

const setEnd = new Action('Set end', 'd', function () {
    const currentTime = state.video.element.currentTime;
    if (state.start != null && currentTime <= state.start) {
        log(`Cannot set end [${formatDuration(currentTime)}] before start [${formatDuration(state.start)}]`);
        return;
    }
    state.end = currentTime;
    log(`${this.name}: [${formatDuration(state.end)}]`);
});

const loadEnd = new Action('Load end', 'e', function () {
    if (state.end == null) return;
    state.video.element.currentTime = state.end;
    state.video.element.pause();
    log(`${this.name}: [${formatDuration(state.end)}]`);
});

const removeEnd = new Action('Remove end', 'r', function () {
    state.end = null;
    log(this.name);
});

const actions = [disableShortcuts, setStart, loadStart, setEnd, loadEnd, removeEnd];
//#endregion
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
