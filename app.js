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
fix systemListener not removed

fix activation deactivation triggered together

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
        addActionListeners();
        removeSystemListeners();
        log(formatActions());
    });

    const deactivateShortcuts = new Action('Deactivate program', '`', function () {
        // order is important
        removeActionListeners();
        addSystemListeners();
        state = clearState();
        log("Shortcuts disabled");
    });

    const saveStart = new Action('Save start', 'a', function () {
        state.start = getVideo().currentTime;
        log(`${this.name} (${formatDuration(getVideo().currentTime)})`);
    });

    const loadStart = new Action('Load start', 's', function () {
        getVideo().currentTime = state.start;
        log(`${this.name} (${formatDuration(state.start)})`);
    });

    const saveLoop = new Action('Save loop', 'd', function () {
        state.end = getVideo().currentTime;
        log(`${this.name} (${formatDuration(getVideo().currentTime)})`);
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
        console.log("addSystemListeners");
        document.addEventListener('keyup', systemListener);
    }

    function removeSystemListeners() {
        console.log("removeSystemListeners");
        document.addEventListener('keyup', systemListener);
    }

    function systemListener(event) {
        if (!eventMatches(event, activateShortcuts)) return;
        activateShortcuts.action();
    }
    //#endregion

    //#region state
    function initState() {
        return {
            start: null,
            end: null,
            video: {
                id: getVideoId(),
                element: getVideo(),
                container: getVideoContainer()
            }
        };
    }

    function clearState() {
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

    // TODO: update log text
    function segmentListener() {
        if (!state.end || getVideo().currentTime < state.end) return;
        const endTime = formatDuration(getVideo().currentTime);
        getVideo().currentTime = state.start;
        console.log(`Segment end (${endTime})\nLoad start (${formatDuration(state.start)})`);
    }

    function videoChangedListener() {
        console.log("videoChangedListener: start");
        if (state.videoId != getVideoId()) return;
        console.log("videoChangedListener: true");
        // TODO
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

    //#region video
    function getVideo() {
        return document.querySelector('video');
    }

    function getVideoContainer() {
        return getVideo().parentElement.parentElement;
    }

    function getVideoId() {
        return new URLSearchParams(window.location.search).get('v');
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

        getVideoContainer().appendChild(alertBox);

        await delay(duration);
        alertBox.style.opacity = '0';
        await delay(animationDuration);
        getVideoContainer().removeChild(alertBox);
    }
})();
