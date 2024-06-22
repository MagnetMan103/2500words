import {getDefinition} from "./storage.mjs";

if (!window.words) {
    window.words = '';
}
if (!window.wordDiv) {
    window.wordDiv = document.getElementById('words');
}
if (!window.table) {
    window.table = document.getElementById('table');
}
if (!window.addWord) {
    window.addWord = document.getElementById('addWord');
}
if (typeof window.addWordActive === 'undefined') {
    window.addWordActive = false;
}

createList().catch(console.error);

document.getElementById('backHome').addEventListener('click', function() {
    console.log('trying to go back home')
    fetch('home.html')
        .then(response => response.text())
        .then(html => {
            document.body.innerHTML = html;
        })
        .then(() => {
            const oldScriptTag = document.querySelector('script');
            document.body.removeChild(oldScriptTag);
            const script = document.createElement('script');
            script.src = 'home.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading new page:', error));
});
// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('backHome').addEventListener('click', function() {
//         console.log('trying')
//         fetch('home.html')
//             .then(response => response.text())
//             .then(html => {
//                 document.body.innerHTML = html;
//             })
//             .then(() => {
//                 const oldScriptTag = document.querySelector('script');
//                 document.body.removeChild(oldScriptTag);
//
//                 const script = document.createElement('script');
//                 script.src = 'home.js';
//                 document.body.appendChild(script);
//             })
//             .catch(error => console.error('Error loading new page:', error));
//     });
// });
addWord.addEventListener('click', () => {
    // create a modal to input a new word
    addWord.textContent = addWordActive ? '+' : 'X'
    addWord.style.backgroundColor = addWordActive ? 'greenyellow' : '#fd5c63'
    if (addWordActive) {
        addWordActive = false
        const modal = document.getElementById('modal')
        if (modal !== null) {
            document.body.removeChild(modal);
        }
        return;
    }
    addWordActive = true;
    const modal = document.createElement('div');
    modal.id = 'modal';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter a word';
    const submit = document.createElement('button');
    submit.innerText = 'Submit';
    modal.appendChild(input);
    modal.appendChild(submit);
    document.body.insertBefore(modal, table);

    submit.addEventListener('click', () => {
        try {

            let definition;
            fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + input.value)
                .then(response => response.json())
                .then(data => {
                    definition = data[0][0][0];
                })
                .then(() => {
                    chrome.storage.sync.set({[input.value]: definition})
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.innerText = input.value;
                    tr.appendChild(td);
                    const translation = document.createElement('td');
                    translation.innerText = definition;
                    tr.appendChild(translation);
                    const rtd = document.createElement('td');
                    const removeButton = document.createElement('button');
                    removeButton.innerText = 'X';
                    removeButton.addEventListener('click', () => {
                        chrome.storage.sync.remove(key, function() {
                            table.removeChild(tr);
                        });
                    });
                    rtd.appendChild(removeButton);
                    tr.appendChild(rtd);
                    table.appendChild(tr);
                    document.body.removeChild(modal);
                    addWordActive=false
                    addWord.textContent='+'
                    addWord.style.backgroundColor='greenyellow'

                })}
        catch (error) {
            console.log(error)
            }
        });
})

async function createList () {
    await chrome.storage.sync.get(null, function(items) {
            // use map to create rows with a word cell and translation cell
            for (const [key, value] of Object.entries(items)) {
                if (key === 'foreign_language' || key === 'native_language') {
                    continue
                }
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.innerText = key;
                tr.appendChild(td);
                table.appendChild(tr);
                // add a remove button for each row

                const translation = document.createElement('td');
                translation.innerText = value;
                tr.appendChild(translation);
                const rtd = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.innerText = 'X';
                removeButton.addEventListener('click', () => {
                    chrome.storage.sync.remove(key, function() {
                        table.removeChild(tr);
                    });
                });
                rtd.appendChild(removeButton);
                tr.appendChild(rtd);
            }
        })


    }
