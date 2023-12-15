function addSystemListeners() {
    document.addEventListener('keyup', systemListener);
}

function removeSystemListeners() {
    document.removeEventListener('keyup', systemListener);
}

function systemListener(event) {
    if (!eventMatches(event, systemActions.enableShortcuts)) return;
    systemActions.enableShortcuts.action();
}

function addActionListeners() {
    document.addEventListener('keyup', keyListener);
    state.video.element.addEventListener('timeupdate', segmentListener);
    document.addEventListener('yt-navigate-finish', videoChangedListener);
}

function removeActionListeners() {
    document.removeEventListener('keyup', keyListener);
    state.video.element.removeEventListener('timeupdate', segmentListener);
    document.removeEventListener('yt-navigate-finish', videoChangedListener);
}

function keyListener(event) {
    Object.values(actions)
        .filter(action => eventMatches(event, action))
        .forEach(action => action.action());
}

function eventMatches(event, action) {
    const keyModifierPressed = event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
    const keyMatches = event.key.toLowerCase() === action.key;

    return !keyModifierPressed && keyMatches;
}

function segmentListener() {
    const eventTime = state.video.element.currentTime;
    if (
        state.start == null ||
        state.end == null ||
        eventTime < state.end ||
        state.video.element.paused
    ) return;

    state.video.element.currentTime = state.start;
    console.log(
        `End reached: [${formatDuration(eventTime)}]\n` +
        `Load start: [${formatDuration(state.start)}]`
    );
}

function videoChangedListener() {
    const idChanged = state.video.id != getUrlVideoId();
    if (idChanged) disableShortcuts.action();
}
