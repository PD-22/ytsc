// ==UserScript==
// @name         Video shortucts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

/*
TODO:
fix video changed listener
exit program on video change

make program active per video
separate program per video
    enable only if the video exists
    fix loop still exists when opening different video
    fix if no video display at the center
fix loop before start
when loop stop transfer video to the end of the loop
save start and loop in localstorage
add go to the end
*/

(function () {
    'use strict';

    let state = clearState();

    class Action {
        constructor(name, key, action) {
            this.name = name;
            this.key = key;
            this.action = action;
        }
    }

    //#region Actions
    const activateShortcuts = new Action('Activate program', '`', function () {
        state = initState();
        if (state) {
            addActionListeners();
            removeSystemListeners();
            log(formatActions());
        } else {
            log("Program activation failed");
        }
    });

    const deactivateShortcuts = new Action('Deactivate program', '`', function () {
        // clear state after removing action listeners
        removeActionListeners();
        addSystemListeners();
        state = clearState();
        log("Shortcuts disabled");
    });

    const saveStart = new Action('Save start', 'a', function () {
        state.start = state.video.element.currentTime;
        log(`${this.name} (${formatDuration(state.video.element.currentTime)})`);
    });

    const loadStart = new Action('Load start', 's', function () {
        state.video.element.currentTime = state.start;
        log(`${this.name} (${formatDuration(state.start)})`);
    });

    const saveLoop = new Action('Save loop', 'd', function () {
        state.end = state.video.element.currentTime;
        log(`${this.name} (${formatDuration(state.video.element.currentTime)})`);
    });

    const clearLoop = new Action('Clear Loop', 'w', function () {
        state.end = null;
        log(this.name);
    });
    //#endregion

    const actions = [deactivateShortcuts, saveStart, loadStart, saveLoop, clearLoop];

    run();

    //#region run
    function run() {
        console.log(`Press "${activateShortcuts.key}" to activate video shortcuts`);
        addSystemListeners();
    }

    function addSystemListeners() {
        document.addEventListener('keyup', systemListener);
    }

    function removeSystemListeners() {
        document.removeEventListener('keyup', systemListener);
    }

    function systemListener(event) {
        if (!eventMatches(event, activateShortcuts)) return;
        activateShortcuts.action();
    }
    //#endregion

    //#region state
    function initState() {
        const video = initVideo();
        return video ? { video, start: null, end: null } : clearState();
    }

    function clearState() {
        return null
    }

    function initVideo() {
        const id = getVideoId();
        const element = getVideoElement();
        const container = getVideoContainer();

        const success = [id, element, container].every(x => Boolean(x));
        return success ? { id, element, container } : clearVideo();

        function getVideoId() {
            return new URLSearchParams(window.location.search).get('v');
        }

        function getVideoElement() {
            return document.querySelector('video.html5-main-video');
        }

        function getVideoContainer() {
            return getVideoElement()?.parentElement?.parentElement;
        }
    }

    function clearVideo() {
        return null
    }
    //#endregion

    //#region listener
    function addActionListeners() {
        document.addEventListener('keyup', keyListener);
        state.video.element.addEventListener('timeupdate', segmentListener);
        // window.addEventListener('yt-navigate-finish', videoChangedListener);
    }

    function removeActionListeners() {
        document.removeEventListener('keyup', keyListener);
        state.video.element.removeEventListener('timeupdate', segmentListener);
        // window.removeEventListener('yt-navigate-finish', videoChangedListener);
    }

    function keyListener(event) {
        getActiveActions().forEach(action => action.action());

        function getActiveActions() {
            return actions.filter(action => eventMatches(event, action));
        }
    }

    function eventMatches(event, action) {
        return !keyModifierPressed(event) && keyMatches(event, action);

        function keyModifierPressed(event) {
            return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
        }

        function keyMatches(event, action) {
            return event.key.toLowerCase() === action.key;
        }
    }

    function segmentListener() {
        if (!state.end || state.video.element.currentTime < state.end) return;
        const endTime = formatDuration(state.video.element.currentTime);
        state.video.element.currentTime = state.start;
        console.log(`Segment end (${endTime})\nLoad start (${formatDuration(state.start)})`);
    }

    function videoChangedListener() {
        console.log("videoChangedListener: start");
        if (state.videoId != state.video.id) return;
        console.log("videoChangedListener: true");
    }
    //#endregion

    //#region formatters
    function formatActions() {
        return [
            'Shortcuts enabled:',
            ...actions.map(formatAction)
        ].join('\n');

        function formatAction(action) {
            return `\t"${action.key}" - ${action.name}`;
        }
    }

    function formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    //#endregion

    function log(text, duration) {
        console.log(text);
        alert(text, duration);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function alert(message, duration = 1000) {
        const alertBox = document.createElement('div');
        alertBox.textContent = message;

        const animationDuration = 300;

        Object.assign(alertBox.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontFamily: '"YouTube Noto", Arial, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            opacity: '1',
            pointerEvents: 'none',
            transition: `opacity ${animationDuration / 1000}s`,
            whiteSpace: 'pre-line',
            zIndex: '9999'
        });

        const alertContainer = state?.video?.container || document.body;
        alertContainer.appendChild(alertBox);

        await delay(duration);
        alertBox.style.opacity = '0';
        await delay(animationDuration);
        alertContainer.removeChild(alertBox);
    }
})();
