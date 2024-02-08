const count = require("./count");

function fork({ lib, path, maxCount, done }) {
  if (!lib) throw new Error("Lib param have to be assigned");

  const method = require(`node:${lib}`);
  const workersCount = count({ max: maxCount });
  const workers = [];
  const results = [];

  for (let i = 0; i < workersCount; i++) {
    const worker = method.fork(path);
    workers.push(worker);
  }

  for (const worker of workers) {
    worker.on("message", data => {
      results.push(data);

      if (results.length === maxCount) {
        if (done) done(results);
        process.exit(0);
      }
    });
  }

  return workers;
};

module.exports = fork;