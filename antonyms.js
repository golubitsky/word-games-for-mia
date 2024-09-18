const fs = require("fs");
const readline = require("readline");

async function loadAntonyms(filePath) {
  const dictionary = {};
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isHeader = true;

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const [lemma, part_of_speech, antonyms] = line.split(",");

    dictionary[lemma] = {
      part_of_speech,
      antonyms: antonyms.split("|"),
    };
  }

  return dictionary;
}

async function main() {
  try {
    const antonymsDictionary = await loadAntonyms("data/antonyms.csv");
    console.log(antonymsDictionary);
  } catch (error) {
    console.error("Error loading antonyms:", error);
  }
}

module.exports = loadAntonyms;
