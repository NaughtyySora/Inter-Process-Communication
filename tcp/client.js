const net = require("node:net");
const config = require("./config");
const { findIndex, commands } = require("../lib/commands/commands");
const client = new net.Socket();

client.setEncoding("utf-8");

const calculate = ({ command, list }) => {
  const fn = commands[command];
  return {result: list.map(fn), index: findIndex(command)};
};

client.on("data", data => {
  const parsed = JSON.parse(data);
  const result = calculate(parsed);
  client.write(JSON.stringify(result));
});

client.on("error", err => {
  console.log("Client error: ", err);
});

client.on("close", () => {
  console.log("Connection closed");
  process.exit(0);
});

client.connect({
  host: config.host,
  port: config.port,
});

setTimeout(() => {
  process.exit(1);
}, 5000);