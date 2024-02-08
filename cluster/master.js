const { getList } = require("../lib/coins/list");
const { commandKeys, length } = require("../lib/commands/commands");
const fork = require("../lib/workers/fork");

const LIST_ITEMS = 10;

(async () => {
  const coinsList = await getList();
  
  const workers = fork({
    lib: "cluster",
    maxCount: length,
    done: (results) => {
      const sorted = [...results].sort((a, b) => a.index - b.index).flatMap(({ result }) => result);
      console.log(sorted);
      process.exit(0);
    }
  });

  let index = 0;
  for (const command of commandKeys) {
    if (index > workers.length - 1) index = 0;

    const worker = workers[index];
    const start = LIST_ITEMS * index;
    const end = LIST_ITEMS * (index + 1);
    const list = coinsList.slice(start, end);
    worker.send({ command, list });
    index++;
  }

})();

setTimeout(() => {
  process.exit(1);
}, 5000);

process.on("uncaughtException", err => {
  console.log("Master error", err);
});