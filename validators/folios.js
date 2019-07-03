const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTableInput(data) {
  let errors = {};

  if (isEmpty(data.folio_no)) {
    errors.folio_no = "Folio No. is required";
  }

  if (isEmpty(data.departure_datetime)) {
    errors.departure_datetime = "Departure date time is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
