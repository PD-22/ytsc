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
