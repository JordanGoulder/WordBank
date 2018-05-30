window.addEventListener('load', function (event) {

    var words; // Array of words to use

    // Get a reference to word list DOM element
    var wordList = document.getElementById('word-list');

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
        while (wordList.hasChildNodes()) {
            wordList.removeChild(wordList.lastChild);
        }

        // Add each of the words to the list
        words.forEach(function (value) {
            var wordTextNode = document.createTextNode(value);
            var wordListItem = document.createElement("li");
            wordListItem.appendChild(wordTextNode);
            wordList.appendChild(wordListItem);
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
        var chosenWords = document.getElementById('chosen-words');
        chosenWords.innerHTML = words[indexOne] + " " + words[indexTwo];
    }

    // Choose a new set of words when the user asks nicely
    var anotherButton = document.getElementById('another');
    anotherButton.addEventListener('click', function (event) {
        chooseNewWords();
    });

    var wordListTextArea = document.getElementById('word-list-edit');
    var cancelEditWordsButton = document.getElementById('cancel-edit-words');
    var saveWordsButton = document.getElementById('save-words');
    var editWordsButton = document.getElementById('edit-words');
    var defaultWordsButton = document.getElementById('default-words');

    // User wants to cancel editing word list
    cancelEditWordsButton.addEventListener('click', function (event) {
        editWordsButton.style.display = "inline";
        wordList.style.display = "block";

        wordListTextArea.style.display = "none";
        saveWordsButton.style.display = "none";
        defaultWordsButton.style.display = "none";
        cancelEditWordsButton.style.display = "none";

        anotherButton.disabled = false;
    });

    // Users wants to use the default word list
    defaultWordsButton.addEventListener('click', function (event) {
        wordListTextArea.value = window.WordBank.words.reduce(function (prev, current) {
            return prev + '\n' + current;
        });
    });

    // User wants to save the word list
    saveWordsButton.addEventListener('click', function (event) {
        editWordsButton.style.display = "inline";
        wordListTextArea.style.display = "none";

        saveWordsButton.style.display = "none";
        defaultWordsButton.style.display = "none";
        cancelEditWordsButton.style.display = "none";
        wordList.style.display = "block";

        anotherButton.disabled = false;

        words = wordListTextArea.value.split('\n');
        storeWordList();
        populateWordListControl();
    });

    // User wants to edit the word list
    editWordsButton.addEventListener('click', function(event) {
        editWordsButton.style.display = "none";
        wordListTextArea.style.display = "inline";

        saveWordsButton.style.display = "inline";
        defaultWordsButton.style.display = "inline";
        cancelEditWordsButton.style.display = "inline";
        wordList.style.display = "none";

        anotherButton.disabled = true;

        wordListTextArea.value = words.reduce(function (prev, current) {
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