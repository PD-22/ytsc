function initState() {
    const video = initVideo();
    return video ? { video, start: null, end: null } : null;
}

function initVideo() {
    const id = new URLSearchParams(window.location.search).get('v');
    const element = document.querySelector('video.html5-main-video')
    const container = element?.parentElement?.parentElement;

    const success = [id, element, container].every(x => Boolean(x));
    return success ? { id, element, container } : null;
}
