let state = clearState();

run();

//#region run
function run() {
    console.log(`Press "${enableShortcuts.key}" to activate video shortcuts`);
    addSystemListeners();
}

function addSystemListeners() {
    document.addEventListener('keyup', systemListener);
}

function removeSystemListeners() {
    document.removeEventListener('keyup', systemListener);
}

function systemListener(event) {
    if (!eventMatches(event, enableShortcuts)) return;
    enableShortcuts.action();
}
//#endregion
