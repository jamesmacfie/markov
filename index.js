const { Command } = require("commander");
const { getTweets } = require("./twit");
const { predict, generateMarkovWords } = require("./markov");

const program = new Command();

const start = async (username, numberOfWOrds, debug) => {
  const tweetStream = await getTweets(username);
  const { startWords, markovWords } = generateMarkovWords(tweetStream);
  if (debug) {
    console.log(markovWords);
    console.log(tweetStream);
  }
  const output = predict(numberOfWOrds, startWords, markovWords);
  console.log(output);
};

program
  .option("-d, --debug", "output things")
  .option("-w, --words <wordcount>", "words to generate", 20)
  .option("-u, --username <username>", "twitter username", "jamesmacfie");

program.parse(process.argv);

start(program.username, program.words, program.debug);
