const os = require("node:os");

const cpus = os.cpus().length;

module.exports = ({ max }) => cpus > max ? max : cpus;