const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTableInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.room_no)) {
    errors.room_no = "Room No. is required";
  }

  if (isEmpty(data.room_type)) {
    errors.room_type = "Room Type is required";
  }

  if (isEmpty(data.room_no)) {
    errors.bed_type = "Bed Type is required";
  }

  if (isEmpty(data.max_key_card_no)) {
    errors.max_key_card_no = "Max Key Card No. is required";
  }

  if (isEmpty(data.room_rate)) {
    errors.room_rate = "Room Rate is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
