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
window.preferenceInput = document.getElementById('preference-input');

window.languageList = document.getElementById('language-list');
window.languageList2 = document.getElementById('language-list2');
window.preferenceList = document.getElementById('preference-list');

window.languagePicker = document.getElementById('language-picker');
window.languagePicker2 = document.getElementById('language-picker2');
window.preferencePicker = document.getElementById('preference-picker');
// i got rid of korean, japanese, and hindi, becauses newsapi does not support them, but I could
// add them back in if I wanted to because the language codes are built in the project
window.languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', "Korean", 'Japanese', 'Hindi',
     'Russian', 'Italian', 'Portuguese', 'Arabic' , 'Dutch', 'Norwegian', 'Swedish'
]

initialize().then(() => {
    createListener(languageInput, languageList, languagePicker, 'foreign_language');
    createListener(languageInput2, languageList2, languagePicker2, 'native_language');
    createCategoryListener()
});

async function initialize() {
    const foreignLanguageResult = await chrome.storage.sync.get('foreign_language');
    const nativeLanguageResult = await chrome.storage.sync.get('native_language');
    const preferenceResult = await chrome.storage.sync.get('user_preferences');
    console.log(preferenceResult)
    languageInput.value = foreignLanguageResult.foreign_language === undefined ? "" : foreignLanguageResult.foreign_language;
    languageInput2.value = nativeLanguageResult.native_language === undefined ? "" : nativeLanguageResult.native_language;
    preferenceInput.value = preferenceResult.user_preferences === undefined ? "" : preferenceResult.user_preferences;
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

function createCategoryListener() {
    inputElement = preferenceInput
    listElement = preferenceList
    pickerElement = preferencePicker
    storageType = 'user_preferences'
    const categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology']
    currentPreferences = inputElement.value.split(", ")
    if (currentPreferences.length === 1 && currentPreferences[0] === "") {
        currentPreferences = []
    }
    console.log(currentPreferences)

    inputElement.addEventListener('click', () => {
        listElement.style.display = 'block';
        listElement.innerHTML = '';
        categories.sort().forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            if (currentPreferences.includes(category)) {
                li.classList.add('selected');
            }
            li.addEventListener('click', () => {
                if (!currentPreferences.includes(category)) {
                    li.classList.add('selected');
                    currentPreferences.push(category)

                } else {
                    li.classList.remove('selected');
                    currentPreferences = currentPreferences.filter((value) => value !== category)
                }
                inputElement.value = computePreferenceInput(currentPreferences)
                chrome.storage.sync.set({[storageType] : inputElement.value})
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


function computePreferenceInput(preferences) {
    // takes an array of string preferences and returns a string of the preferences
    // sorted alphabetically and separated by ", "
    // if preferences is an array of a single element, returns that element
    if (preferences.length === 1) {
        return preferences[0]
    }
    return preferences.sort().join(", ")
}
