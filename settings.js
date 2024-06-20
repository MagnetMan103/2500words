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
if (!window.languagePicker) {
    window.languagePicker = document.getElementById('language-picker');
}
if (!window.languageInput) {
    window.languageInput = document.getElementById('language-input');
}
if (!window.languageList) {
    window.languageList = document.getElementById('language-list');
}
if (!window.languages) {
    window.languages = [
        'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
        'Korean', 'Russian', 'Italian', 'Portuguese', 'Arabic', 'Hindi'
    ];
}
// const languagePicker = document.getElementById('language-picker');
// const languageInput = document.getElementById('language-input');
// const languageList = document.getElementById('language-list');
//
// const languages = [
//     'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
//     'Korean', 'Russian', 'Italian', 'Portuguese', 'Arabic', 'Hindi'
//     // Add more languages as needed
// ];

document.getElementById('language-input').addEventListener('input', () => {
    console.log('2')
    const query = languageInput.value.toLowerCase();
    languageList.innerHTML = '';

    if (query) {
        const filteredLanguages = languages.filter(language =>
            language.toLowerCase().includes(query)
        );
        console.log('3')

        if (filteredLanguages.length > 0) {
            languageList.style.display = 'block';
            filteredLanguages.forEach(language => {
                const li = document.createElement('li');
                li.textContent = language;
                li.addEventListener('click', () => {
                    languageInput.value = language;
                    languageList.style.display = 'none';
                });
                languageList.appendChild(li);
                console.log('4')
            });
        } else {
            languageList.style.display = 'none';
        }
    } else {
        languageList.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    if (!languagePicker.contains(event.target)) {
        languageList.style.display = 'none';
    }
});
