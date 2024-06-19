chrome.runtime.onInstalled.addListener(async () => {

    chrome.contextMenus.create({
        title: 'Add "%s" to 2500words',
        type: 'normal',
        contexts: ['selection'],
        id: 'test',
    });

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.coords) {
        console.log('Coordinates received from content script:', message.coords);
        // Handle the coordinates as needed
    }
    // Optionally send a response back to the content script
    sendResponse({ status: 'received' });
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
    console.log('attempting to use contextmenu')
    try {
        console.log('attempting to add word to 2500words:', item.selectionText)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'executeScript', word: item.selectionText }, (response) => {
                console.log('Response from content script:', response);
            });
        });
    }
    catch (error) {
        console.error(error)
    }
});


