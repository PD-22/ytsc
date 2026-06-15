const defaultModifier = {
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false
};

class Action {
    constructor(name, key, action, modifier = defaultModifier) {
        this.name = name;
        this.key = key;
        this.action = action;
        this.modifier = { ...defaultModifier, ...modifier };
    }
}

const actions = {
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

    rate: new Action('"Alt+Num" - Playback Rate', null, function (e) {
        const rate = [.5, 1, 1.5, 2, 4, 8][e.key];
        if (!rate) return;
        const video = document.querySelector('video');
        video.playbackRate = rate;
        log(`${rate.toFixed(1)}x`, undefined, 'alert-rate');
    }, { altKey: true }),

    overlay: new Action('Toggle overlay', 'p', function (e) {
        const selectors = [
            '.ytp-chrome-top',
            '.ytp-chrome-bottom',
            '.ytp-gradient-bottom',
            '.ytp-gradient-top',
            '.ytp-chrome-top-buttons',
            '.ytp-ce-element',
            '.ytp-paid-content-overlay',
            '.ytp-fullscreen-metadata',
            '.ytp-fullscreen-quick-actions',
            '.ytp-overlay-inline-container',
        ];

        selectors.forEach(s => {
            const e = document.querySelector(s);
            if (!e) return;
            const visibility = e.style.visibility === 'hidden' ? 'visible' : 'hidden';
            e.style.visibility = visibility;
        });
    }),

    remind: new Action('Remind shortcuts', 'z', function (e) {
        const existing = document.querySelector('#shortcuts-reminder');
        if (existing) return void existing.remove();
        log(formatActions(), 0, 'shortcuts-reminder');
    }),
};
