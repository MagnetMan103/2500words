let words = '';
const wordDiv = document.getElementById('words');
const table = document.getElementById('table');

createList().catch(console.error);

async function createList () {
    await chrome.storage.sync.get('words', function(result) {
        words = result.words || [];
        console.log(words)
        words.forEach(word => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerText = word.word;
            tr.appendChild(td);
            table.appendChild(tr);
            // add a remove button for each row
            const removeButton = document.createElement('button');
            removeButton.innerText = 'X';
            removeButton.addEventListener('click', () => {
                const index = words.findIndex(w => w.word === word.word);
                words.splice(index, 1);
                chrome.storage.sync.set({ words: words });
                table.removeChild(tr);
            });
            tr.appendChild(removeButton);
        });

    });
}