
let coords = {x: 0, y: 0};
document.addEventListener('contextmenu', (e) => {
    console.log('right clicked', e.clientX, e.clientY)
    coords = {x: e.x, y: e.y};
    chrome.runtime.sendMessage({coords: {x: e.clientX, y: e.clientY}}, (response) => {
        console.log('Message sent to background script:', response);
    });
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'executeScript') {
        console.log('Message received from background script:', message);
        // Execute the desired script or actions
        displayDefinition(message.word, coords);

        // Respond back to background script if necessary
        sendResponse({ status: 'Script executed' });
    }
});

async function displayDefinition(word, coords) {
    let definition;

    const div = document.createElement('div');
    div.id = '2500words';
    div.style.all = 'initial';
    div.style.position = 'absolute';
    div.style.top = (coords.y + window.scrollY - 40) + 'px';
    div.style.left = (coords.x + window.scrollX - 20) + 'px';
    div.style.backgroundColor = '#353935';
    div.style.color = 'white';
    div.style.zIndex = '9999';
    div.style.display = 'flex';
    div.style.borderColor = 'black';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px';
    const close = document.createElement('button');
    close.textContent = 'X';
    close.style.all = 'initial';
    close.style.fontWeight = 'bold';
    close.style.padding = '5px';
    close.style.backgroundColor = 'white';
    close.addEventListener('mouseover', () => {
        close.style.opacity = '0.5';
    })
    close.addEventListener('mouseout', () => {
        close.style.opacity = '1';
    })
    close.addEventListener('click', () => {
        document.body.removeChild(div);
    })


    await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=' + word)
        .then(response => response.json())
        .then(data => {
            definition = data[0][0][0];
        })
        .then(() => {
            chrome.storage.sync.set({[word]: definition})
            console.log('finished')
        })
        .catch(error => {
            console.error(error)
        })
    console.log('starting')
    const wordElement = document.createElement('span');
    wordElement.style.all = 'initial';
    wordElement.style.fontWeight = 'bold'; // Make the word bold
    wordElement.style.color = 'white';
    wordElement.style.fontFamily = 'Arial';
    wordElement.style.userSelect = 'none';
    wordElement.style.cursor = 'move';
    wordElement.textContent = `${word}: `;

    const definitionElement = document.createElement('span');
    definitionElement.style.all = 'initial';
    definitionElement.style.color = 'white';
    definitionElement.style.fontFamily = 'Arial';
    definitionElement.style.userSelect = 'none';
    definitionElement.style.cursor = 'move';
    definitionElement.textContent = `${definition}`;

    const text = document.createElement('p');
    text.style.all = 'initial';
    text.style.color = 'white';
    text.style.padding = '5px';
    text.style.userSelect = 'none';
    text.style.cursor = 'move';
    text.appendChild(wordElement);
    text.appendChild(definitionElement);

    let isDragging = false;
    let dragStartX, dragStartY;

    text.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX - div.offsetLeft;
        dragStartY = e.clientY - div.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            div.style.left = (e.clientX - dragStartX) + 'px';
            div.style.top = (e.clientY - dragStartY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    div.appendChild(text);
    div.appendChild(close);
    document.body.appendChild(div);

}
