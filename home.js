
document.getElementById('wordList').addEventListener('click', function() {
    // console.log('trying to go to word list')
    fetch('popup.html')
        .then(response => response.text())
        .then(html => {
            document.body.innerHTML = html;
        })
        .then(() => {
            const oldScriptTag = document.querySelector('script');
            document.body.removeChild(oldScriptTag);
            const script = document.createElement('script');
            script.src = 'popup.js';
            document.body.appendChild(script);
            // console.log('now')
        })
        .catch(error => console.error('Error loading new page:', error));
});

document.getElementById('settings').addEventListener('click', function() {
    // console.log('trying to go to settings')
    fetch('settings.html')
        .then(response => response.text())
        .then(html => {
            document.body.innerHTML = html;
        })
        .then(() => {
            const oldScriptTag = document.querySelector('script');
            document.body.removeChild(oldScriptTag);
            const script = document.createElement('script');
            script.src = 'settings.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading new page:', error));
});

document.getElementById('practice').addEventListener('click', function() {
    // console.log('trying to go to practice')
    fetch('practice.html')
        .then(response => response.text())
        .then(html => {
            document.body.innerHTML = html;
        })
        .then(() => {
            const oldScriptTag = document.querySelector('script');
            // console.log(oldScriptTag)
            document.body.removeChild(oldScriptTag);
            const script = document.createElement('script');
            script.src = 'practice.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading new page:', error));
})


