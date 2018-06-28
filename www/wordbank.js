window.WordBank = (function WordBank(Storage) {
  // Set of default words to use
  var _DEFAULT_WORDS = [
    'Naughty',
    'Cat',
    'Armageddon',
    'Hat',
    'Kite',
    'Racer',
    'Clown',
    'Court',
    'Dating',
    'Dapper',
    'Noir',
    'Mustache',
    'Train',
    'Witch',
    'Cop',
    'Valorous',
    'Punk',
    'Hair',
    'Holiday',
    'Pirate',
    'Music',
    'Space',
    'Dystopia',
    'Trial',
    'Magic',
    'Animal',
    'BEAR',
    'School',
    'Book',
    'Superpowers',
    'Appliance',
    'Hunter',
    'Company',
    'Hacking',
    'Adorable',
    'Death',
    'Dragon',
    'Fight'
  ];

    // Current set of words
    // Read the words from storage or fall back to the default set
  var _words = Storage.get('words', _DEFAULT_WORDS, true);

  // Return the current set of words
  var words = function words() {
    return _words.slice();
  };

  // Set the words for the WordBank
  var setWords = function setWords(newWords) {
    // Copy the specified words to our word set making sure to
    // trim off any white space and remove empty strings
    _words = newWords
      .slice()
      .map(function trimWord(word) {
        return word.trim();
      })
      .filter(function removeEmptyStrings(word) {
        return word.length > 0;
      });

    // Write the words to storage
    Storage.set('words', _words);
  };

  // Return the default set of words
  var defaultWords = function defaultWords() {
    return _DEFAULT_WORDS.slice();
  };

  var chooseRandomWords = function chooseRandomWords(count) {
    // Get the count of words to choose with default of 2
    var wordCount = Number(count) || 2;

    // Can't choose more words than we have in the list
    wordCount = Math.min(wordCount, _words.length);

    // Object used to store chosen words as property names
    var chosenWords = {};

    // Get the number of words requested
    while (wordCount--) {
      var index;

      // Choose the next work, being careful not to choose one that has
      // already been chosen
      do {
        index = Math.floor(Math.random() * _words.length);
      }
      while (chosenWords.hasOwnProperty(_words[index]));

      // Save the chosen word as a property
      chosenWords[_words[index]] = true;
    }

    // Return the words as an Array
    return Object.getOwnPropertyNames(chosenWords);
  };

  return {
    words: words,
    setWords: setWords,
    defaultWords: defaultWords,
    chooseRandomWords: chooseRandomWords
  };
})(Storage);
