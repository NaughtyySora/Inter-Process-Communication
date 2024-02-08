const https = require("node:https");

const httpGet = (path, callback) => {
  const client = https.get(path);
  let buffers = [];

  client.on("response", response => {
    response.on("data", data => {
      buffers.push(data);
    });

    response.on("close", () => {
      const buffer = Buffer.concat(buffers);
      callback(null, {buffer, code: response.statusCode});
    });

    response.on("error", err => {
      callback(err);
    });
  });

  client.on("error", err => {
    callback(err);
  });
};

module.exports = httpGet;