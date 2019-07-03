const numeral = require("numeral");

const numberFormat = value => {
  return numeral(numeral(value).format("0.00")).value();
};

module.exports = numberFormat;
