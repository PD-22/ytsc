function log(text, duration, id) {
    console.log(text);
    alert(text, duration, id);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
