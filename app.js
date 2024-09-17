const loadPronunciationGroups = require("./pronunciation");

async function main() {
  const groups = await loadPronunciationGroups("data/cmudict-0.7b.txt");
  console.log(groups)
}
main();
