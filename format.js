function formatAction({ key, name }) {
    return key ? `"${key}" - ${name}` : `\t${name}`;
}

function formatActions() {
    return Object.values(actions).map(a => '\t' + formatAction(a)).join('\n');
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
