const { commands, findIndex } = require("../lib/commands/commands");
// const cluster = require("node:cluster");S

process.on("message", ({ command, list }) => {
  // console.log({command, list, id: cluster.worker.id});
  const fn = commands[command];
  const result = list.map(fn);
  process.send({ result, index: findIndex(command) });
});

process.on("uncaughtException", err => {
  console.log("Worker error", err);
});