export async function getDefinition(word) {
    const foreign_language = await chrome.storage.sync.get('foreign_language').foreign_language;
    const native_language = await chrome.storage.sync.get('native_language').native_language;
    const languageCodes = [
        {'English': 'en'}, {'Spanish': 'es'}, {'French': 'fr'}, {'German': 'de'}, {'Chinese': 'zh-CN'}, {'Japanese': 'ja'},
        {'Korean': 'ko'}, {'Russian': 'ru'}, {'Italian': 'it'}, {'Portuguese': 'pt'}, {'Arabic': 'ar'}, {'Hindi': 'hi'}
    ]
    let foreignLanguageCode = languageCodes.find(language => language[foreign_language]);
    let nativeLanguageCode = languageCodes.find(language => language[native_language]);
    if (!foreignLanguageCode || !nativeLanguageCode) {
        foreignLanguageCode = 'auto';
        nativeLanguageCode = 'en';
        console.log('using default values')
    }
    console.log(foreignLanguageCode, nativeLanguageCode)
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${foreignLanguageCode[foreign_language]}&tl=${nativeLanguageCode[native_language]}&dt=t&q=${word}`)
        .then(response => response.json())
        .then(data => {
            chrome.storage.sync.set({[word]: data[0][0][0]})
            return data[0][0][0];
        })
        .catch(error => {
            console.error(error)
        })
}