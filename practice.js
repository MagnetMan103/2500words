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
// footer
window.prev = document.getElementById('prev');
window.next = document.getElementById('next');
window.statusBar = document.getElementById('status');
// flashcard
window.front = document.getElementById('front');
window.back = document.getElementById('back');
window.flashcard = document.getElementById('flashcard');
window.flashcardContainer = document.getElementById('flashcard-container');
// misc
window.flipped = false;
document.getElementById('flashcard-container').addEventListener('click', function() {
    this.children[0].classList.toggle('flipped');
    flipped = !flipped;
});
window.items = [];
window.count = 1;
prev.style.opacity = 0.5;
prev.style.cursor = 'default';
next.style.cursor = 'pointer'
console.log(items)
randomizeItems().then(data => {
    items = data;
    front.textContent = items[0][0];
    back.textContent = items[0][1];
    statusBar.textContent = `${count}/${items.length}`;
    console.log(items)
    console.log(items[2])
})

// add event listener for when space is pressed
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        flashcard.classList.toggle('flipped');
        flipped = !flipped;
    }
});

next.addEventListener('click', function() {

    if (prev.style.opacity === '0.5') {
        prev.style.opacity = 1;
        prev.style.cursor = 'pointer'

    }
    if (count < items.length) {

        flashcardContainer.classList.add('slide-right');
        count++;
        setTimeout(() => {
            flashcardContainer.classList.remove('slide-right');
            front.textContent = items[count - 1][0];
            back.textContent = items[count - 1][1];
            statusBar.textContent = `${count}/${items.length}`;
            if (flipped) {
                front.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
                back.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
                flipped = !flipped
            }
        }, 100);
        if (count === items.length) {
            next.style.opacity = 0.5;
            next.style.cursor = 'default';
        }
    }
});

prev.addEventListener('click', function() {
    if (next.style.opacity === '0.5') {
        next.style.opacity = 1;
        next.style.cursor = 'pointer';
    }
    if (count > 1) {
        count--;

        flashcardContainer.classList.add('slide-left');
        setTimeout(() => {
            flashcardContainer.classList.remove('slide-left');
            front.textContent = items[count - 1][0];
            back.textContent = items[count - 1][1];
            statusBar.textContent = `${count}/${items.length}`;
            if (flipped) {
                front.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
                back.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
                flipped = !flipped
            }
        }, 100);
        if (count === 1) {
            prev.style.opacity = 0.5;
            prev.style.cursor = 'default';
        }
    }
})
async function randomizeItems() {
    const result = await chrome.storage.sync.get(null);
    let items = Object.entries(result);
    // filter out items with key values of native_language and foreign_language
    items = items.filter(item => {
        return item[0] !== 'native_language' && item[0] !== 'foreign_language';
    });
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}