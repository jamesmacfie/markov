const hasPeriodAtEnd = (word) => {
  return word.charAt(word.length - 1) === ".";
};

const removePeriodFromEndOfWord = (word) => {
  if (hasPeriodAtEnd(word)) {
    return word.slice(0, word.length - 1);
  }

  return word;
};

const extractWords = (word) => {
  if (hasPeriodAtEnd(word)) {
    return [removePeriodFromEndOfWord(word), "."];
  }

  return [word];
};

const clean = (word) => {
  return word.replace(/(["”,'?!])/gm, "");
};

const generateMarkovWords = (sentence) => {
  const startWords = [];
  const markovWords = {};
  const words = sentence.split(" ").map((w) => w.toLowerCase());

  startWords.push(clean(words[0]));

  for (var i = 0; i < words.length; i++) {
    const word = clean(words[i]);
    const key = removePeriodFromEndOfWord(word);
    if (!words[i + 1]) {
      break;
    }
    const nextWords = extractWords(clean(words[i + 1]));
    if (markovWords[key]) {
      markovWords[key].neighbours = markovWords[key].neighbours.concat(
        nextWords
      );
    } else {
      markovWords[key] = {
        neighbours: nextWords,
      };
    }

    if (hasPeriodAtEnd(word)) {
      startWords.push(removePeriodFromEndOfWord(words[i + 1]));
    }
  }

  return { startWords, markovWords };
};

const getStartWord = (startWords) => {
  return clean(startWords[Math.floor(Math.random() * startWords.length)]);
};

const getNextWord = (currentWord, markovWords) => {
  const word = markovWords[currentWord];

  try {
    const nextWord =
      word.neighbours[Math.floor(Math.random() * word.neighbours.length)];

    return nextWord;
  } catch (err) {
    return "";
  }
};

const predict = (numberOfWords, startWords, markovWords) => {
  const start = getStartWord(startWords);
  let sentence = start;
  let currentWord = start;

  for (var i = 0; i < numberOfWords; i++) {
    const nextWord = getNextWord(currentWord, markovWords);
    if (nextWord === ".") {
      const newStateWord = getStartWord(startWords);
      sentence = `${sentence}. ${newStateWord}`;
      currentWord = newStateWord;
    } else {
      sentence = `${sentence} ${nextWord}`;
      currentWord = nextWord;
    }
  }

  return sentence;
};

module.exports = {
  generateMarkovWords,
  predict,
};
