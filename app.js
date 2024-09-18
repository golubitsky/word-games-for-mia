const pronunciation = require("./pronunciation");
const loadAntonyms = require("./antonyms");

async function findGroupsWithMultipleAntonyms(groups, antonyms) {
  const result = [];

  for (const group of groups) {
    const wordsWithAntonyms = group.filter((word) => antonyms[word]);
    if (wordsWithAntonyms.length == 1) {
      const h = {};

      for (const word of wordsWithAntonyms) {
        h[group] = antonyms[word].antonyms[0];
      }
      result.push(h);
    }
  }

  return result;
}

async function main() {
  const groups = await pronunciation.loadGroups("data/cmudict-0.7b.txt");
  const antonyms = await loadAntonyms("data/antonyms.csv");

  const groupsWithAntonyms = await findGroupsWithMultipleAntonyms(
    groups,
    antonyms
  );

  console.dir(groupsWithAntonyms, { maxArrayLength: null });
}
main();
