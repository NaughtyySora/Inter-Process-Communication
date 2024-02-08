const fromEntries = (ds, fn) => {
  const entries = Object.entries(ds);
  const result = entries.map(fn);
  return Object.fromEntries(result);
};

const api = {
  commands: {
    getName: ({ name }) => ({ name }),
    upperAll: item => fromEntries(item, ([key, value]) => [key, value.toUpperCase()]),
    pad: item => fromEntries(item, ([key, value]) => [key, value += "          "]),
    toBinary: item => fromEntries(item, ([key, value]) => [key, JSON.stringify(Buffer.from(value))]),
  },
  get commandKeys() {
    return Object.keys(this.commands);
  },
  get length() {
    return this.commandKeys.length;
  },
  findIndex: (name) => api.commandKeys.indexOf(name),
};

module.exports = api