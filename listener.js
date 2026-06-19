function addActionListeners() {
    if (!state || !state.video || !state.video.element) return;
    document.addEventListener('keyup', keyListener);
    state.video.element.addEventListener('timeupdate', segmentListener);
}

function removeActionListeners() {
    document.removeEventListener('keyup', keyListener);
    if (state?.video?.element) {
        state.video.element.removeEventListener('timeupdate', segmentListener);
    }
}

function isEditableElement(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
        return true;
    }
    
    if (element.isContentEditable) {
        return true;
    }
    
    if (element.getAttribute('role') === 'textbox' || 
        element.getAttribute('role') === 'searchbox') {
        return true;
    }
    
    return false;
}

function keyListener(event) {
    if (isEditableElement(event.target)) {
        return;
    }
    
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