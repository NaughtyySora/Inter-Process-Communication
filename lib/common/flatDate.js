const flatDate = date => {
  const local = new Date(date);
  local.setHours(0, 0, 0, 0)
  return local.getTime();
};

module.exports = flatDate;