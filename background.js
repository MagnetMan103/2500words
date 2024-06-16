
chrome.runtime.onInstalled.addListener(async () => {

    chrome.contextMenus.create({
        title: 'Add word to 2500words',
        type: 'normal',
        contexts: ['selection'],
        id: 'test',
    });

    chrome.contextMenus.onClicked.addListener((item, tab) => {
        try {
            // chrome.storage.sync.set({[item.selectionText]: 'word'})
            chrome.storage.sync.get('words', function(result) {
                let words = result.words || [];
                words.push({word: item.selectionText});
                chrome.storage.sync.set({ words: words });
            });
        }
        catch (error) {
            console.error(error)
        }
    });
});

// chrome.runtime.onInstalled.addListener(async () => {
//     chrome.contextMenus.create({
//         title: 'test',
//         type: 'normal',
//         contexts: ['selection'],
//         onclick: function(e){
//             console.log(e)
//         }
//     });
// });