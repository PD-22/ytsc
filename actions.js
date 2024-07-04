class Action {
    constructor(name, key, action) {
        this.name = name;
        this.key = key;
        this.action = action;
    }
}

const systemActions = {
    enableShortcuts: new Action('Enable shortcuts', '`', function () {
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
    disableShortcuts: new Action('Disable shortcuts', '`', function () {
        removeActionListeners();
        addSystemListeners();
        log("Shortcuts disabled", 3000);
        state = null;
    }),

    setStart: new Action('Set start', 'a', function () {
        const currentTime = state.video.element.currentTime;
        if (state.end != null && currentTime >= state.end) {
            log(`Cannot set start [${formatDuration(currentTime)}] after end [${formatDuration(state.end)}]`);
            return;
        }
        state.start = currentTime;
        log(`${this.name}: [${formatDuration(state.start)}]`);
    }),

    loadStart: new Action('Load start', 's', function () {
        if (state.start == null) return;
        state.video.element.currentTime = state.start;
        log(`${this.name}: [${formatDuration(state.start)}]`);
    }),

    setEnd: new Action('Set end', 'd', function () {
        const currentTime = state.video.element.currentTime;
        if (state.start != null && currentTime <= state.start) {
            log(`Cannot set end [${formatDuration(currentTime)}] before start [${formatDuration(state.start)}]`);
            return;
        }
        state.end = currentTime;
        log(`${this.name}: [${formatDuration(state.end)}]`);
    }),

    loadEnd: new Action('Load end', 'e', function () {
        if (state.end == null) return;
        state.video.element.currentTime = state.end;
        state.video.element.pause();
        log(`${this.name}: [${formatDuration(state.end)}]`);
    }),

    removeEnd: new Action('Remove end', 'r', function () {
        state.end = null;
        log(this.name);
    }),

    skipAd: new Action('Skip Ad', 'g', function () {
        const selector = 'button.ytp-skip-ad-button';
        document.querySelector(selector).click();
    }),

    like: new Action('Like', 'h', function () {
        const selector = 'like-button-view-model button';
        document.querySelector(selector).click();
    }),

    dislike: new Action('Dislike', 'y', function () {
        const selector = 'dislike-button-view-model button';
        document.querySelector(selector).click();
    }),

    focus: new Action('Focus video', 'u', function () {
        document.querySelector('video').focus()
    }),

    float: new Action('Toggle float', 'b', function () {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            document.querySelector('video').requestPictureInPicture();
        }
    }),

    save: new Action('Save frame', 'n', function () {
        const video = document.querySelector('video');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png')

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'frame.png';
        link.click();
    }),

    clean: new Action('Clean', 'q', function () {
        clearAlerts();
    }),
};
