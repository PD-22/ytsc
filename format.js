function formatActions() {
    return [
        'Shortcuts enabled:',
        ...actions.map(formatAction)
    ].join('\n');
}

function formatAction(action) {
    return `\t"${action.key}" - ${action.name}`;
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
