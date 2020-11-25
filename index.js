const { Command } = require("commander");
const { getTweets } = require("./twit");

const program = new Command();

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

const generateMarkovWords = (sentence) => {
  const startWords = [];
  const markovWords = {};
  const words = sentence.split(" ").map((w) => w.toLowerCase());

  startWords.push(words[0]);

  for (var i = 0; i < words.length; i++) {
    const word = words[i];
    const key = removePeriodFromEndOfWord(word);
    if (!words[i + 1]) {
      break;
    }
    const nextWords = extractWords(words[i + 1]);
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
  return startWords[Math.floor(Math.random() * startWords.length)];
};

const getNextWord = (currentWord, markovWords) => {
  const word = markovWords[currentWord];

  const nextWord =
    word.neighbours[Math.floor(Math.random() * word.neighbours.length)];

  return nextWord;
};

const generate = (numberOfWords, startWords, markovWords) => {
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

const start = async (username, numberOfWOrds, debug) => {
  const tweetStream = await getTweets(username);
  const { startWords, markovWords } = generateMarkovWords(tweetStream);
  if (debug) {
    console.log(markovWords);
    console.log(tweetStream);
  }
  const output = generate(numberOfWOrds, startWords, markovWords);
  console.log(output);
};

program
  .option("-d, --debug", "output things")
  .option("-w, --words <wordcount>", "words to generate", 20)
  .option("-u, --username <username>", "twitter username", "jamesmacfie");

program.parse(process.argv);

start(program.username, program.words, program.debug);
