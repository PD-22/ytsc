function log(text, duration) {
    console.log(text);
    alert(text, duration);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
