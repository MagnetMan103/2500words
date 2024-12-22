
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
    // console.log('trying to go back home')
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
    modal.style.marginBottom = '10px';
    modal.style.marginTop = '5px';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a word';
    const submit = document.createElement('button');
    submit.innerText = 'Submit';
    submit.style.backgroundColor = 'greenyellow';
    submit.style.borderWidth = '1.5px';

    modal.appendChild(input);
    modal.appendChild(submit);
    document.body.insertBefore(modal, table);

    submit.addEventListener('click', async () => {
        if (!addWordActive) {return}
        addWordActive = false
        if (input.value === '') {
            document.body.removeChild(modal);
            addWordActive = false
            addWord.textContent = '+'
            addWord.style.backgroundColor = 'greenyellow'
            return;
        }
        getDefinition(input.value).then(data => {
            const definition = data;
            // console.log('definition', definition)
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
                chrome.storage.sync.remove(input.value, function () {
                    table.removeChild(tr);
                    document.getElementById("wordHeader").textContent = `${table.rows.length - 1} Words`
                });
            });
            rtd.appendChild(removeButton);
            tr.appendChild(rtd);
            table.appendChild(tr);
            document.body.removeChild(modal);
            addWord.textContent = '+'
            addWord.style.backgroundColor = 'greenyellow'
            document.getElementById("wordHeader").textContent = `${table.rows.length - 1} Words`
        })
    });
})

async function createList () {
    await chrome.storage.sync.get(null, function(items) {
            for (const [key, value] of Object.entries(items)) {
                if (key === 'foreign_language' || key === 'native_language' || key === 'rotation_preference'
                    || key === 'user_preferences') {
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
                        document.getElementById("wordHeader").textContent = `${table.rows.length - 1} Words`
                    });
                });
                rtd.appendChild(removeButton);
                tr.appendChild(rtd);
            }
            document.getElementById("wordHeader").textContent = `${table.rows.length - 1} Words`
        })


    }

async function getDefinition(word) {
    const foreign_language = (await chrome.storage.sync.get('foreign_language')).foreign_language;
    const native_language = (await chrome.storage.sync.get('native_language')).native_language;
    const languageCodes = {
        'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Chinese': 'zh-CN', 'Japanese': 'ja',
        'Korean': 'ko', 'Russian': 'ru', 'Italian': 'it', 'Portuguese': 'pt', 'Arabic': 'ar', 'Hindi': 'hi',
        'Dutch': 'nl', 'Norwegian': 'no', 'Swedish': 'sv'
    }
    let foreignLanguageCode = languageCodes[foreign_language];
    let nativeLanguageCode = languageCodes[native_language];
    if (!foreignLanguageCode || !nativeLanguageCode) {
        foreignLanguageCode = 'auto';
        nativeLanguageCode = 'en';
        // console.log('using default values')
    }
    // console.log(foreignLanguageCode, nativeLanguageCode)
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${foreignLanguageCode}&tl=${nativeLanguageCode}&dt=t&q=${word}`);
    const data = await response.json();
    await chrome.storage.sync.set({[word]: data[0][0][0]});
    return data[0][0][0];
}

