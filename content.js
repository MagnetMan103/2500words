
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


    definition = await getDefinition(word);
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


async function getDefinition(word) {
    const foreign_language = (await chrome.storage.sync.get('foreign_language')).foreign_language;
    const native_language = (await chrome.storage.sync.get('native_language')).native_language;
    const languageCodes = {
        'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Chinese': 'zh-CN', 'Japanese': 'ja',
        'Korean': 'ko', 'Russian': 'ru', 'Italian': 'it', 'Portuguese': 'pt', 'Arabic': 'ar', 'Hindi': 'hi'
    }
    let foreignLanguageCode = languageCodes[foreign_language];
    let nativeLanguageCode = languageCodes[native_language];
    if (!foreignLanguageCode || !nativeLanguageCode) {
        foreignLanguageCode = 'auto';
        nativeLanguageCode = 'en';
        console.log('using default values')
    }
    console.log(foreignLanguageCode, nativeLanguageCode)
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${foreignLanguageCode}&tl=${nativeLanguageCode}&dt=t&q=${word}`);
    const data = await response.json();
    await chrome.storage.sync.set({[word]: data[0][0][0]});
    return data[0][0][0];
}