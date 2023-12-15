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

async function alert(message, duration = 1000) {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;

    Object.assign(alertBox.style, alertStyles);

    const alertContainer = state?.video?.container || document.body;
    alertContainer.appendChild(alertBox);

    await delay(duration);
    alertBox.style.opacity = '0';

    await delay(alertTransitionDuration);
    alertContainer.removeChild(alertBox);
}
