const { Command } = require("commander");
const { predict, generateMarkovWords } = require("./markov");
const fs = require("fs");
const path = require("path");

const program = new Command();

const start = async (wordCount) => {
  const file = path.join(__dirname, "war.txt");
  fs.readFile(file, "utf8", function (err, data) {
    if (err) throw err;
    const { startWords, markovWords } = generateMarkovWords(data);
    const output = predict(wordCount, startWords, markovWords);
    console.log(output);
  });
};

program.option("-w, --words <wordcount>", "words to generate", 200);

program.parse(process.argv);

start(program.words);
