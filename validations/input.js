const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validateInput = (data, fieldName) => {
  let errors = {};
  data[fieldName] = !isEmpty(data[fieldName]) ? data[fieldName] : "";
  if (validator.isEmpty(data[fieldName])) {
    errors[fieldName] = `${fieldName} field is required`;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
