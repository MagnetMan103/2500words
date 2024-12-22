createRoute('wordList', 'wordlist/wordlist.html', 'wordlist/wordlist.js');
createRoute('settings', 'settings/settings.html', 'settings/settings.js');
createRoute('practice', 'practice/practice.html', 'practice/practice.js');

function createRoute(elementId, html, js) {
    document.getElementById(elementId).addEventListener('click', function() {
        fetch(html)
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
            })
            .then(() => {
                const oldScriptTag = document.querySelector('script');
                document.body.removeChild(oldScriptTag);
                const script = document.createElement('script');
                script.src = js;
                document.body.appendChild(script);
            })
            .catch(error => console.error('Error loading new page:', error));
    });
}

// when the button with id "findArticle" is pressed, send the user to the url "example.com"

window.findArticleElement = document.getElementById('findArticle');

createURL().then(url => {
    if (url === undefined) {
        findArticleElement.className = 'deactivated';
        return;
    }
    findArticleElement.addEventListener('click', async function () {
        chrome.tabs.create({
            url: url
        });
    });
}).catch(error => console.error('Error loading article url:', error));

window.languageCodes = {
    'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Chinese': 'zh-CN', 'Japanese': 'ja',
    'Korean': 'ko', 'Russian': 'ru', 'Italian': 'it', 'Portuguese': 'pt', 'Arabic': 'ar', 'Hindi': 'hi',
    'Dutch': 'nl', 'Norwegian': 'no', 'Swedish': 'sv'
}

async function createURL() {
    const preferenceResult = await chrome.storage.sync.get('user_preferences');
    let preferenceArray = preferenceResult.user_preferences.split(', ');
    if (preferenceArray.length === 1 && preferenceArray[0] === "") {
        preferenceArray = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology']
    }
    const language = await chrome.storage.sync.get('foreign_language');
    const languageCode = languageCodes[language.foreign_language];

    const category = preferenceArray[Math.floor(Math.random() * preferenceArray.length)].toLowerCase();

    const response = await fetch(`https://2500db.vercel.app/random_article/${category}/${languageCode}`);
    const data = await response.json();
    return data.url;

}