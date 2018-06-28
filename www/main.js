window.addEventListener('load', function windowLoad() {
  // Get references to all the DOM elements
  var dom = {
    wordList: document.getElementById('word-list'),
    chosenWords: document.getElementById('chosen-words'),
    anotherButton: document.getElementById('another'),
    wordListTextArea: document.getElementById('word-list-edit'),
    cancelEditWordsButton: document.getElementById('cancel-edit-words'),
    saveWordsButton: document.getElementById('save-words'),
    editWordsButton: document.getElementById('edit-words'),
    defaultWordsButton: document.getElementById('default-words'),
    listEditControls: document.getElementById('list-edit-controls'),
    listDisplayControls: document.getElementById('list-display-controls')
  };

    // Update the word list
  function updateWordList() {
    // Remove all the items from the word list
    while (dom.wordList.hasChildNodes()) {
      dom.wordList.removeChild(dom.wordList.lastChild);
    }

    // Add each of the words to the list
    window.WordBank.words().forEach(function addWordToList(word) {
      var wordTextNode = document.createTextNode(word);
      var wordListItem = document.createElement('li');
      wordListItem.appendChild(wordTextNode);
      dom.wordList.appendChild(wordListItem);
    });
  }

  // Update the chosen words
  function updateChosenWords() {
    var chosenWords = window.WordBank.chooseRandomWords();

    if (chosenWords.length > 1) {
      // Display the chosen words
      dom.chosenWords.innerHTML = chosenWords.join(' ');
    } else {
      // Tell the user they need more words
      dom.chosenWords.innerHTML = 'Not enough words to choose from!';
    }
  }

  // Choose a new set of words when the user asks nicely
  dom.anotherButton.addEventListener('click', function anotherButtonClick() {
    updateChosenWords();
  });

  // User wants to cancel editing word list
  dom.cancelEditWordsButton.addEventListener('click', function cancelEditWordsButtonClick() {
    dom.listDisplayControls.classList.remove('hidden');
    dom.listEditControls.classList.add('hidden');
    dom.anotherButton.disabled = false;
  });

  // Users wants to use the default word list
  dom.defaultWordsButton.addEventListener('click', function defaultWordsButtonClick() {
    dom.wordListTextArea.value = window.WordBank.defaultWords().join('\n');
  });

  // User wants to save the word list
  dom.saveWordsButton.addEventListener('click', function saveWordsButtonClick() {
    dom.listDisplayControls.classList.remove('hidden');
    dom.listEditControls.classList.add('hidden');
    dom.anotherButton.disabled = false;

    window.WordBank.setWords(dom.wordListTextArea.value.split('\n'));

    updateWordList();
  });

  // User wants to edit the word list
  dom.editWordsButton.addEventListener('click', function editWordsButtonClick() {
    dom.listDisplayControls.classList.add('hidden');
    dom.listEditControls.classList.remove('hidden');
    dom.anotherButton.disabled = true;

    dom.wordListTextArea.value = window.WordBank.words().join('\n');
  });

  // Update the word list
  updateWordList();

  // Update the chosen words
  updateChosenWords();
});
