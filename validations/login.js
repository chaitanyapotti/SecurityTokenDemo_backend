const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validateLoginInput = data => {
  let errors = {};
  data.usernameOrEmail = !isEmpty(data.usernameOrEmail) ? data.usernameOrEmail : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (validator.isEmpty(data.usernameOrEmail)) {
    errors.usernameOrEmail = "Email field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
