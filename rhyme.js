const pronunciation = require("./pronunciation");

function groupedByRhyme(
  dictionary,
  minPhonemeLength = 3,
  rhymeSuffixPhonemeLength = 3
) {
  const rhymeGroups = {};

  Object.entries(dictionary).forEach(([word, phonemes]) => {
    const totalPhonemes = phonemes.length;

    if (totalPhonemes < minPhonemeLength) {
      return;
    }

    if (rhymeSuffixPhonemeLength > totalPhonemes) {
      return;
    }

    const rhymeKey = phonemes.slice(-rhymeSuffixPhonemeLength).join(" ");

    if (!rhymeGroups[rhymeKey]) {
      rhymeGroups[rhymeKey] = [];
    }

    rhymeGroups[rhymeKey].push(word);
  });

  return Object.values(rhymeGroups).filter((group) => group.length > 1);
}

function createRhymeGroupIndex(rhymeGroups) {
  const wordIndex = {};

  // Add default array
  rhymeGroups.forEach((group, groupIndex) => {
    group.forEach((word) => {
      wordIndex[word] = [];
    });
  });

  // Collect indexes
  rhymeGroups.forEach((group, groupIndex) => {
    group.forEach((word) => {
      wordIndex[word].push(groupIndex);
    });
  });

  // Pick the group with the most words for each word
  Object.keys(wordIndex).forEach((word) => {
    const groupIndexes = wordIndex[word];
    let largestGroupIndex = null;
    let largestGroupSize = 0;

    groupIndexes.forEach((groupIndex) => {
      const groupSize = rhymeGroups[groupIndex].length;
      if (groupSize > largestGroupSize) {
        largestGroupSize = groupSize;
        largestGroupIndex = groupIndex;
      }
    });

    wordIndex[word] = largestGroupIndex;
  });

  return wordIndex;
}

async function main() {
  const dictionary = await pronunciation.loadPronunciation(
    "data/cmudict-0.7b.txt"
  );

  const rhymeGroups = groupedByRhyme(dictionary, 4, 2);

  const rhymeIndex = createRhymeGroupIndex(rhymeGroups);
  console.log(rhymeGroups[rhymeIndex["test"]])
  console.log(rhymeGroups[rhymeIndex["smell"]])
}

main();
