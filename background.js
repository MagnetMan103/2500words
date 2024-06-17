let coords = {x: 0, y: 0};
chrome.runtime.onInstalled.addListener(async () => {

    chrome.contextMenus.create({
        title: 'Add "%s" to 2500words',
        type: 'normal',
        contexts: ['selection'],
        id: 'test',
    });


    chrome.contextMenus.onClicked.addListener((item, tab) => {
        try {
            let definition;
            console.log(item)
            fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + item.selectionText)
                .then(response => response.json())
                .then(data => {
                    definition = data[0][0][0];
                })
                .then(() => {
                    chrome.storage.sync.set({[item.selectionText]: definition})
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'executeScript', word: item.selectionText }, (response) => {
                            console.log('Response from content script:', response);
                        });
                    });
                    });
        }
        catch (error) {
            console.error(error)
        }
    });

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.coords) {
        console.log('Coordinates received from content script:', message.coords);
        // Handle the coordinates as needed
        coords = message.coords
    }
    // Optionally send a response back to the content script
    sendResponse({ status: 'received' });
});



