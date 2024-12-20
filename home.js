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


