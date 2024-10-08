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
        .forEach(action => action.action(event));
}

function eventMatches(event, action) {
    const modifierMatches = (
        event.shiftKey === action.modifier.shiftKey &&
        event.ctrlKey === action.modifier.ctrlKey &&
        event.altKey === action.modifier.altKey &&
        event.metaKey === action.modifier.metaKey
    );
    const keyMatches = action.key === null || event.key.toLowerCase() === action.key;

    return modifierMatches && keyMatches;
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
    if (idChanged) actions.disableShortcuts.action();
}

function getUrlVideoId() {
    return new URLSearchParams(window.location.search).get('v');
}
