function formatActions() {
    return [
        'Shortcuts enabled:',
        ...actions.map(action => `\t"${action.key}" - ${action.name}`)
    ].join('\n');
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
