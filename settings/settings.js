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
window.languageInput = document.getElementById('language-input');
window.languageInput2 = document.getElementById('language-input2');

window.languageList = document.getElementById('language-list');
window.languageList2 = document.getElementById('language-list2');

window.languagePicker = document.getElementById('language-picker');
window.languagePicker2 = document.getElementById('language-picker2');

window.languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Russian', 'Italian', 'Portuguese', 'Arabic', 'Hindi'
]

initialize()
createListener(languageInput, languageList, languagePicker, 'foreign_language');
createListener(languageInput2, languageList2, languagePicker2, 'native_language');

async function initialize() {
    const foreignLanguageResult = await chrome.storage.sync.get('foreign_language');
    const nativeLanguageResult = await chrome.storage.sync.get('native_language');
    if (foreignLanguageResult.foreign_language === undefined || nativeLanguageResult.native_language === undefined) {
        return;
    }
    languageInput.value = foreignLanguageResult.foreign_language;
    languageInput2.value = nativeLanguageResult.native_language;
}

function createListener(inputElement, listElement, pickerElement, storageType) {
    inputElement.addEventListener('click', () => {
        listElement.style.display = 'block';
        listElement.innerHTML = '';
        languages.sort().forEach(language => {
            const li = document.createElement('li');
            li.textContent = language;
            if (inputElement.value === language) {
                li.style.backgroundColor = 'lightgreen';
            }
            li.addEventListener('click', () => {
                inputElement.value = language;
                listElement.style.display = 'none';
                // set chrome storage language here
                chrome.storage.sync.set({[storageType] : language})
            });
            listElement.appendChild(li);
        });
    });
    document.addEventListener('click', (event) => {
        if (!pickerElement.contains(event.target)) {
            listElement.style.display = 'none';
        }
    });
}
