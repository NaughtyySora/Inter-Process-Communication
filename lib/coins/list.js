const { promisify } = require("node:util");
const { writeFile, readFile, lstat } = require("node:fs/promises");
const path = require("node:path");

const { geckoAPI } = require("../gecko/routes");
const flatDate = require("../common/flatDate");
const httpGet = require("../http/httpGet");

const LIST_PATH = path.resolve("../lib/storage/list.json");

const flat = (date = Date.now()) => flatDate(new Date(date).getTime());
const promisifyGet = promisify(httpGet.bind(null, geckoAPI.list));

const freshCoins = ({ birthtime }) => {
  const now = flat();
  const fileTime = flat(birthtime);
  return now === fileTime;
};

const writeList = async () => {
  try {
    const { buffer, code } = await promisifyGet();
    if (code !== 200) throw new Error("Status code: ", code);
    await writeFile(LIST_PATH, buffer);
    return buffer;
  } catch (err) {
    throw err;
  }
};

const getList = async () => {
  try {
    const stat = await lstat(LIST_PATH);
    const fresh = freshCoins(stat);
    if (!fresh) throw new Error("Coins is expired");
    const list = await readFile(LIST_PATH);
    return JSON.parse(list);
  } catch (reason) {
    const data = await writeList();
    const parsedBuffer = data.toString();
    return JSON.parse(parsedBuffer);
  }
};

module.exports = { getList };