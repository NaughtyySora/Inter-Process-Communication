const geckoAPI = {
  base: "https://api.coingecko.com/api/v3/",
  get list() {
    return `${this.base}/coins/list`;
  },
};

module.exports = { geckoAPI };