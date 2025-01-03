document.getElementById('backHome').addEventListener('click', function() {
    // console.log('trying to go back home')
    document.removeEventListener('keydown', handleKeyDown);

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
prev.classList.add('disabledFooterBtn');
next.classList.add('enabledFooterBtn');
// console.log(items)
initialize();
async function initialize() {
    randomizeItems().then(data => {
        if (data.length === 0) {
            next.style.opacity = 0.3;
            next.style.cursor = 'default';
            return;
        }
        items = data;
        front.textContent = items[0][0];
        back.textContent = items[0][1];
        statusBar.textContent = `${count}/${items.length}`;
        if (items.length === 1) {
            next.style.opacity = 0.3;
            next.style.cursor = 'default';
        }
        // console.log(items)
        // console.log(items[2])
    })
}

async function restart() {
    if (items.length <= 1) {
        return; // nothing to do if there is only one or zero item
    }
    if (flipped) {
        front.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
        back.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
        flipped = !flipped
    }
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    count = 1
    front.textContent = items[0][0];
    back.textContent = items[0][1];
    statusBar.textContent = `${count}/${items.length}`;
    prev.classList.add('disabledFooterBtn');
    prev.classList.remove('enabledFooterBtn');
    if (next.textContent === '🔄') {
        next.textContent = '➡️';
        next.removeEventListener('click', restart);
    }

}

document.addEventListener('keydown', handleKeyDown);

next.addEventListener('click', function() {
    // console.log(count)
    if (count < items.length) {
        goRight()
    }
});

// add event listener for when right arrow is pressed

prev.addEventListener('click', function() {

    if (count > 1) {
        goLeft()
    }
})

window.flipCard = document.getElementById('rotate')
flipCard.addEventListener('click', function() {
    flashcard.classList.toggle('flipped');
    flipCard.style.background = flipCard.style.background === "linear-gradient(lightskyblue 50%, blue 50%)" ? 'linear-gradient(to bottom, blue 50%, lightskyblue 50%)': 'linear-gradient(to bottom, lightskyblue 50%, blue 50%)';
    const rotation_preference = flipCard.style.background === "linear-gradient(lightskyblue 50%, blue 50%)" ? "true" : "false";
    chrome.storage.sync.set({'rotation_preference': rotation_preference})
})
async function randomizeItems() {
    const result = await chrome.storage.sync.get(null);
    // console.log('hi',(await chrome.storage.sync.get('rotation_preference')).rotation_preference)
    if ((await chrome.storage.sync.get('rotation_preference')).rotation_preference === 'true') {
        // console.log('yup')
        flipCard.style.background = 'linear-gradient(to bottom, lightskyblue 50%, blue 50%)';
        // flashcard.classList.toggle('flipped');
        front.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
        back.style.transform = front.style.transform==="rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
    }
    let items = Object.entries(result);
    // filter out items with key values of native_language and foreign_language
    items = items.filter(item => {
        return item[0] !== 'native_language' && item[0] !== 'foreign_language' && item[0] !== 'rotation_preference'
            && item[0] !== 'user_preferences';
    });
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

function goRight() {
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
        // next.style.opacity = 0.3;
        // next.style.cursor = 'default';
        next.textContent = '🔄';
        next.addEventListener('click', restart)
    }
    if (prev.classList.contains('disabledFooterBtn')) {
        prev.classList.remove('disabledFooterBtn');
        prev.classList.add('enabledFooterBtn');

    }
}

function goLeft() {
    flashcardContainer.classList.add('slide-left');
    count--;
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
        prev.classList.add('disabledFooterBtn');
        prev.classList.remove('enabledFooterBtn');
    }
    if (next.textContent === '🔄') {
        next.textContent = '➡️';
        next.removeEventListener('click', restart);
    }
}

function handleKeyDown(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        flashcard.classList.toggle('flipped');
        flipped = !flipped;
    }
    if (event.code === 'ArrowRight') {
        if (count < items.length) {
            goRight()
        }
    }
    if (event.code === 'ArrowLeft') {
        if (count > 1) {
            goLeft()
        }
    }
    if (event.code === 'KeyR') {
        restart()
    }
}

