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
window.languagePicker = document.getElementById('language-picker');
window.languageInput = document.getElementById('language-input');
window.languageList = document.getElementById('language-list');
window.languagePicker2 = document.getElementById('language-picker2');
window.languageInput2 = document.getElementById('language-input2');
window.languageList2 = document.getElementById('language-list2');

window.languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Russian', 'Italian', 'Portuguese', 'Arabic', 'Hindi'
]

initialize()
async function initialize() {
    const foreignLanguageResult = await chrome.storage.sync.get('foreign_language');
    const nativeLanguageResult = await chrome.storage.sync.get('native_language');
    if (foreignLanguageResult.foreign_language === undefined || nativeLanguageResult.native_language === undefined) {
        console.log('activated')
        return;
    }
    languageInput.value = foreignLanguageResult.foreign_language;
    languageInput2.value = nativeLanguageResult.native_language;
}

// if (chrome.storage.sync.get('foreign_language') !== undefined) {
//     console.log(chrome.storage.sync.get('foreign_language'))
//     languageInput.value = await chrome.storage.sync.get('foreign_language');
// }

// const languagePicker = document.getElementById('language-picker');
// const languageInput = document.getElementById('language-input');
// const languageList = document.getElementById('language-list');
//
// const languages = [
//     'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
//     'Korean', 'Russian', 'Italian', 'Portuguese', 'Arabic', 'Hindi'
//     // Add more languages as needed
// ];

languageInput.addEventListener('input', () => {
    const query = languageInput.value.toLowerCase();
    languageList.innerHTML = '';

    if (query) {
        const filteredLanguages = languages.filter(language =>
            language.toLowerCase().includes(query)
        );

        if (filteredLanguages.length > 0) {
            languageList.style.display = 'block';
            filteredLanguages.forEach(language => {
                const li = document.createElement('li');
                li.textContent = language;
                li.addEventListener('click', () => {
                    languageInput.value = language;
                    languageList.style.display = 'none';
                    // set chrome storage language here
                    chrome.storage.sync.set({'foreign_language': language})
                });
                languageList.appendChild(li);
            });
        } else {
            languageList.style.display = 'none';
        }
    } else {
        languageList.style.display = 'none';
    }
});

languageInput2.addEventListener('input', () => {
    const query = languageInput2.value.toLowerCase();
    languageList2.innerHTML = '';

    if (query) {
        const filteredLanguages = languages.filter(language =>
            language.toLowerCase().includes(query)
        );

        if (filteredLanguages.length > 0) {
            languageList2.style.display = 'block';
            filteredLanguages.forEach(language => {
                const li = document.createElement('li');
                li.textContent = language;
                li.addEventListener('click', () => {
                    languageInput2.value = language;
                    languageList2.style.display = 'none';
                    chrome.storage.sync.set({'native_language': language})
                });
                languageList2.appendChild(li);
            });
        } else {
            languageList2.style.display = 'none';
        }
    } else {
        languageList2.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    if (!languagePicker.contains(event.target)) {
        languageList.style.display = 'none';
    }
});
