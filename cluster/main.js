const cluster = require("node:cluster");
if(cluster.isPrimary) require("./master.js");
else require("./worker.js");