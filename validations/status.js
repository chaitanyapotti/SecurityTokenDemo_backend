const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validateStatusInput = data => {
  let errors = {};
  data.id = !isEmpty(data.id) ? data.id : "";
  if (validator.isEmpty(data.id)) {
    errors.id = "id field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
