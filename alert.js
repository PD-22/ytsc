const alertTransitionDuration = 300;

const alertStyles = {
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
    transition: `opacity ${alertTransitionDuration}ms`,
    whiteSpace: 'pre-line',
    zIndex: '9999'
};

const alertList = new Set();

async function alert(message, duration = 1000, id) {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.id = id;

    Object.assign(alertBox.style, alertStyles);

    const container = document
        .querySelector('video.html5-main-video')
        ?.parentElement?.parentElement;
    const alertContainer = state?.video?.container || container || document.body;
    if (id) alertContainer.querySelector(`#${id}`)?.remove();
    alertContainer.appendChild(alertBox);

    const remove = () => alertBox.remove();
    alertList.add(remove);

    await delay(duration);
    alertBox.style.opacity = '0';

    await delay(alertTransitionDuration);
    alertList.delete(remove);
    remove();
}

function clearAlerts() {
    alertList.forEach(f => f());
    alertList.clear();
}
