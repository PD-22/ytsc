class Action {
    constructor(name, key, action) {
        this.name = name;
        this.key = key;
        this.action = action;
    }
}

const systemActions = {
    enableShortcuts: new Action('Enable shortcuts', '`', () => {
        state = initState();
        if (state) {
            removeSystemListeners();
            addActionListeners();
            log(formatActions(), 3000);
        } else {
            log("Shortcut activation failed");
        }
    })
};

const actions = {
    disableShortcuts: new Action('Disable shortcuts', '`', () => {
        removeActionListeners();
        addSystemListeners();
        log("Shortcuts disabled", 3000);
        state = null;
    }),

    setStart: new Action('Set start', 'a', () => {
        const currentTime = state.video.element.currentTime;
        if (state.end != null && currentTime >= state.end) {
            log(`Cannot set start [${formatDuration(currentTime)}] after end [${formatDuration(state.end)}]`);
            return;
        }
        state.start = currentTime;
        log(`${this.name}: [${formatDuration(state.start)}]`);
    }),

    loadStart: new Action('Load start', 's', () => {
        if (state.start == null) return;
        state.video.element.currentTime = state.start;
        log(`${this.name}: [${formatDuration(state.start)}]`);
    }),

    setEnd: new Action('Set end', 'd', () => {
        const currentTime = state.video.element.currentTime;
        if (state.start != null && currentTime <= state.start) {
            log(`Cannot set end [${formatDuration(currentTime)}] before start [${formatDuration(state.start)}]`);
            return;
        }
        state.end = currentTime;
        log(`${this.name}: [${formatDuration(state.end)}]`);
    }),

    loadEnd: new Action('Load end', 'e', () => {
        if (state.end == null) return;
        state.video.element.currentTime = state.end;
        state.video.element.pause();
        log(`${this.name}: [${formatDuration(state.end)}]`);
    }),

    removeEnd: new Action('Remove end', 'r', () => {
        state.end = null;
        log(this.name);
    }),
};
