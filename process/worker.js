const { commands, findIndex } = require("../lib/commands/commands");

process.on("message", ({ command, list }) => {
  const fn = commands[command];
  const result = list.map(fn);
  process.send({ result, index: findIndex(command) });
});

process.on("uncaughtException", err => {
  console.log("Worker error", err);
});