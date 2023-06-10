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
when page loads:
    console log toggleShortcuts key
    start listening for toggleShortcuts only
when toggleShortcuts activates the program:
    initialize state
    add change video listener
    add key listener
    add loop listener
when toggleShortcuts deactivates the program:
    clear state
    remove change video listener
    remove key listener
    remove loop listener
when video changes:
    reset loop listener
    reset state
    alert log shortcuts disabled
    console log toggleShortcuts key

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

    let state;

    class Action {
        constructor(name, key, action, alwaysEnabled) {
            this.name = name;
            this.key = key;
            this.action = action;
            this.alwaysEnabled = alwaysEnabled;
        }
    }

    //#region Actions
    const toggleShortcuts = new Action('Toggle shortcuts', '`', function () {
        state.programActive = !state.programActive;
        if (state.programActive) {
            log(formatActions(), 3000);
        } else {
            log("Shortcuts disabled");
            // initializeProgram();
        }
    }, true);

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

    const actions = [toggleShortcuts, saveStart, loadStart, saveLoop, clearLoop];

    console.log(`Press "${toggleShortcuts.key}" to toggle video shortcuts`);
    initialize();

    function initialize() {
        console.log("initializeProgram"); // TEMP
        state = initState();
        initEventListeners();
    }

    function initState() {
        return {
            videoId: getVideoId(),
            start: null,
            end: null,
            programActive: false,
        };
    }

    function initEventListeners() {
        getVideo().removeEventListener('timeupdate', segmentLoopHandler);
        getVideo().addEventListener('timeupdate', segmentLoopHandler);

        document.removeEventListener('keyup', keyHandler);
        document.addEventListener('keyup', keyHandler);

        window.removeEventListener('yt-navigate-finish', videoChangedHandler);
        window.addEventListener('yt-navigate-finish', videoChangedHandler);
    }

    // Event Handlers
    function keyHandler(event) {
        if (keyModifierPressed(event)) return;

        getActiveActions().forEach(action => action.action());

        function getActiveActions() {
            let result = actions.filter(opt => opt.key === event.key.toLowerCase());
            if (!state.programActive) result = result.filter(opt => opt.alwaysEnabled);
            return result;
        }

        function keyModifierPressed(event) {
            return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
        }
    }

    function segmentLoopHandler() {
        if (!state.programActive) return;
        if (!state.end || getVideo().currentTime < state.end) return;
        const endTime = formatDuration(getVideo().currentTime);
        getVideo().currentTime = state.start;
        console.log(`Segment end (${endTime})\nLoad start (${formatDuration(state.start)})`);
    }

    function videoChangedHandler() {
        if (state.videoId != getVideoId()) return;
        initialize();
    }

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

    function log(text, duration) {
        console.log(text);
        alert(text, duration);
    }

    function getVideo() {
        return document.querySelector('video');
    }

    function getVideoContainer() {
        return getVideo().parentElement.parentElement;
    }

    function getVideoId() {
        return new URLSearchParams(window.location.search).get('v');
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

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
