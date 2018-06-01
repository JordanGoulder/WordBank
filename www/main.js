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
        defaultWordsButton:     document.getElementById('default-words')
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
                words = window.WordBank.words;
                storeWordList();
            }
            else {
                words = JSON.parse(wordsString);
            }
        }
        else {
            words = window.WordBank.words;
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
        // Pick two different indexs
        var indexOne = Math.floor(Math.random() * words.length);
        var indexTwo = Math.floor(Math.random() * words.length);
        while ((words.length > 1) && (indexOne == indexTwo)) {
            indexTwo = Math.floor(Math.random() * words.length);
        }

        // Display the chosen words
        dom.chosenWords.innerHTML = words[indexOne] + " " + words[indexTwo];
    }

    // Choose a new set of words when the user asks nicely
    dom.anotherButton.addEventListener('click', function (event) {
        chooseNewWords();
    });

    // User wants to cancel editing word list
    dom.cancelEditWordsButton.addEventListener('click', function (event) {
        dom.editWordsButton.style.display = "inline";
        dom.wordList.style.display = "block";

        dom.wordListTextArea.style.display = "none";
        dom.saveWordsButton.style.display = "none";
        dom.defaultWordsButton.style.display = "none";
        dom.cancelEditWordsButton.style.display = "none";

        dom.anotherButton.disabled = false;
    });

    // Users wants to use the default word list
    dom.defaultWordsButton.addEventListener('click', function (event) {
        dom.wordListTextArea.value = window.WordBank.words.reduce(function (prev, current) {
            return prev + '\n' + current;
        });
    });

    // User wants to save the word list
    dom.saveWordsButton.addEventListener('click', function (event) {
        dom.editWordsButton.style.display = "inline";
        dom.wordListTextArea.style.display = "none";

        dom.saveWordsButton.style.display = "none";
        dom.defaultWordsButton.style.display = "none";
        dom.cancelEditWordsButton.style.display = "none";
        dom.wordList.style.display = "block";

        dom.anotherButton.disabled = false;

        words = dom.wordListTextArea.value.split('\n');
        storeWordList();
        populateWordListControl();
    });

    // User wants to edit the word list
    dom.editWordsButton.addEventListener('click', function(event) {
        dom.editWordsButton.style.display = "none";
        dom.wordListTextArea.style.display = "inline";

        dom.saveWordsButton.style.display = "inline";
        dom.defaultWordsButton.style.display = "inline";
        dom.cancelEditWordsButton.style.display = "inline";
        dom.wordList.style.display = "none";

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