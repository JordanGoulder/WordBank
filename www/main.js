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

    // Write the word list to storage
    function writeWordList()
    {
        window.Storage.set('words', words);
    }

    // Read the word list from storage or fall back to default list
    function readWordList()
    {
        words = window.Storage.get('words', window.WordBank.DEFAULT_WORDS, true);
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
        writeWordList();
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

    // Read the word list
    readWordList();

    // Populate the word list control
    populateWordListControl();

    // Choose the first set of words
    chooseNewWords();
});