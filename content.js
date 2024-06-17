
const button = document.createElement('button');
button.textContent = 'test';
button.addEventListener('click', () => {
    console.log('hi')
    button.textContent = 'clicked!'
})

button.style.position = 'absolute'
button.style.top = '0'
button.style.left = '0'
button.style.zIndex = '9999'
document.body.appendChild(button);
let coords = {x: 0, y: 0};
document.addEventListener('contextmenu', (e) => {
    console.log('right clicked', e.clientX, e.clientY)
    coords = {x: e.clientX, y: e.clientY};
    chrome.runtime.sendMessage({coords: {x: e.clientX, y: e.clientY}}, (response) => {
        console.log('Message sent to background script:', response);
    });
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'executeScript') {
        console.log('Message received from background script:', message);
        // Execute the desired script or actions
        console.log(coords);

        // Respond back to background script if necessary
        sendResponse({ status: 'Script executed' });
    }
});

console.log('done')

function displayDefinition(word) {
    fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + word)
        .then(response => response.json())
        .then(data => {
            definition = data[0][0][0];
            console.log(definition)
        })
        .catch(error => {
            console.error(error)
        })
}
