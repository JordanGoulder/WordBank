window.addEventListener('load', function (event) {

    // Initial set of words
    var words = window.WordBank.words;

    // Get a reference to word list DOM element
    var wordList = document.getElementById('word-list');

    // Populate the word list from the current array of words
    function populateWordList()
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
        populateWordList();
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

    // Populate the words list
    populateWordList();

    // Choose the first set of words
    chooseNewWords();
});