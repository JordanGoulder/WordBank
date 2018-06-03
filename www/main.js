window.addEventListener('load', function (event) {

    // Get references to all the DOM elements
    var dom = {
        wordList:               document.getElementById('word-list'),
        chosenWords:            document.getElementById('chosen-words'),
        anotherButton:          document.getElementById('another'),
        wordListTextArea:       document.getElementById('word-list-edit'),
        cancelEditWordsButton:  document.getElementById('cancel-edit-words'),
        saveWordsButton:        document.getElementById('save-words'),
        editWordsButton:        document.getElementById('edit-words'),
        defaultWordsButton:     document.getElementById('default-words'),
        listEditControls:       document.getElementById('list-edit-controls'),
        listDisplayControls:    document.getElementById('list-display-controls')
    };

    var words; // Array of words to use

    // Checks to see of storage is supported and available
    // From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    function storageAvailable(type)
    {
        try {
            var storage = window[type], x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException &&
                (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededEror' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
                ) &&
                // acknowledge QuoteExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    // Store word list to browser localStorage
    function storeWordList()
    {
        if (storageAvailable('localStorage')) {
            localStorage.setItem('words', JSON.stringify(words));
        }
    }

    // Restore word list from browser localStorage or fall back to default list
    function restoreWordList()
    {
        if (storageAvailable('localStorage')) {
            var wordsString = this.localStorage.getItem('words');

            if (wordsString === null) {
                words = window.WordBank.DEFAULT_WORDS;
                storeWordList();
            }
            else {
                words = JSON.parse(wordsString);
            }
        }
        else {
            words = window.WordBank.DEFAULT_WORDS;
        }
    }

    // Populate the word list control from the current array of words
    function populateWordListControl()
    {
        // Remove all the items from the word list
        while (dom.wordList.hasChildNodes()) {
            dom.wordList.removeChild(dom.wordList.lastChild);
        }

        // Remove leading and trailing whitespace from words
        words = words.map(function (word) {
            return word.trim();
        });

        // filter out any empty strings
        words = words.filter(function (word) {
            return word !== '';
        });

        // Add each of the words to the list
        words.forEach(function (word) {
            var wordTextNode = document.createTextNode(word);
            var wordListItem = document.createElement("li");
            wordListItem.appendChild(wordTextNode);
            dom.wordList.appendChild(wordListItem);
        });
    }

    // Pick two new words and display them
    function chooseNewWords()
    {
        if (words.length > 1) {
            // Pick two different indices
            var indexOne = Math.floor(Math.random() * words.length);
            var indexTwo = Math.floor(Math.random() * words.length);
            while (indexOne == indexTwo) {
                indexTwo = Math.floor(Math.random() * words.length);
            }

            // Display the chosen words
            dom.chosenWords.innerHTML = words[indexOne] + " " + words[indexTwo];
        }
        else {
            // Tell the user they need more words
            dom.chosenWords.innerHTML = 'Not enough words to choose from!';
        }
    }

    // Choose a new set of words when the user asks nicely
    dom.anotherButton.addEventListener('click', function (event) {
        chooseNewWords();
    });

    // User wants to cancel editing word list
    dom.cancelEditWordsButton.addEventListener('click', function (event) {
        dom.listDisplayControls.classList.remove('hidden');
        dom.listEditControls.classList.add('hidden');
        dom.anotherButton.disabled = false;
    });

    // Users wants to use the default word list
    dom.defaultWordsButton.addEventListener('click', function (event) {
        dom.wordListTextArea.value = window.WordBank.DEFAULT_WORDS.reduce(function (prev, current) {
            return prev + '\n' + current;
        });
    });

    // User wants to save the word list
    dom.saveWordsButton.addEventListener('click', function (event) {
        dom.listDisplayControls.classList.remove('hidden');
        dom.listEditControls.classList.add('hidden');
        dom.anotherButton.disabled = false;

        words = dom.wordListTextArea.value.split('\n');
        storeWordList();
        populateWordListControl();
    });

    // User wants to edit the word list
    dom.editWordsButton.addEventListener('click', function(event) {
        dom.listDisplayControls.classList.add('hidden');
        dom.listEditControls.classList.remove('hidden');
        dom.anotherButton.disabled = true;

        dom.wordListTextArea.value = words.reduce(function (prev, current) {
            return prev + '\n' + current;
        });
    });

    // Restore the word list
    restoreWordList();

    // Populate the word list control
    populateWordListControl();

    // Choose the first set of words
    chooseNewWords();
});