const fs = require("fs");
const readline = require("readline");

async function loadPronunciation(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const dictionary = {};
  for await (const line of rl) {
    if (/^[A-Z]/.test(line)) {
      const parts = line.split(/\s+/);

      const word = parts[0];
      const phonemes = parts.slice(1);

      // Ignore words with numbers, like ADELMAN(1), or apostrophes, like AIDE'S
      if (!/[\'\d]/.test(word)) {
        dictionary[word] = phonemes;
      }
    }
  }

  return dictionary;
}

function groupsOfWordsWithSamePronunciation(dictionary) {
  const pronunciationGroups = new Map();

  for (const [word, phonemes] of Object.entries(dictionary)) {
    const phonemeKey = phonemes.join(" ");

    if (!pronunciationGroups.has(phonemeKey)) {
      pronunciationGroups.set(phonemeKey, []);
    }
    pronunciationGroups.get(phonemeKey).push(word);
  }

  return Array.from(pronunciationGroups.values()).filter(
    (group) => group.length > 1
  );
}

async function loadPronunciationGroups(filename) {
  try {
    const dictionary = await loadPronunciation(filename);
    return groupsOfWordsWithSamePronunciation(dictionary);
  } catch (error) {
    console.error("Error loading pronunciations:", error);
  }
}


module.exports = loadPronunciationGroups;