const net = require("node:net");
const config = require("./config");

const { commandKeys, length } = require("../lib/commands/commands");
const { getList } = require("../lib/coins/list");

let list = null;
(async () => {
  list = await getList();
})();

const writeSocket = socket => {
  let index = 0;

  return (items = 10) => {
    const start = items * index;
    const end = items + start;
    socket.write(JSON.stringify({ command: commandKeys[index++], list: list.slice(start, end) }));
  };
};

const results = () => ({
  result: [],
  add(item) {
    this.result.push(item);
    return this;
  },
  print() {
    const result = [...this.result].sort((a, b) => a.index - b.index).flatMap(({ result }) => result);
    console.dir(result, { depth: Infinity });
  },
  get length() {
    return this.result.length;
  }
});

const server = net.createServer();

server.on("connection", socket => {
  const send = writeSocket(socket);
  const storage = results();
  send();

  socket.on("error", err => {
    console.log("Client socket error:", err);
  });

  socket.on("close", () => {
    console.log("Connection left");
  });

  socket.on("data", buffer => {
    const json = buffer.toString();
    storage.add(JSON.parse(json))

    if (storage.length === length) {
      storage.print();
      socket.end();
    }
    else send();
  });
});

server.on("error", err => {
  console.log(`\x1b[31m Server error: ${err}\x1b[0m`);
});

server.listen(config.port, config.host, () => {
  console.log("Server started on: " + config.host + ":" + config.port);
});