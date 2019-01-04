const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validateRegisterInput = data => {
  let errors = {};
  data.username = !isEmpty(data.username) ? data.username : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.username, { min: 3, max: 10 })) {
    errors.username = "username must be in between 3 & 10 Characters";
  }

  if (!validator.isLength(data.password, { min: 5, max: 15 })) {
    errors.password = "Password must be in between 5 & 15 Characters";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "passwords must match";
  }

  if (validator.isEmpty(data.username)) {
    errors.username = "username field is required";
  }

  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "firstname field is required";
  }

  if (validator.isEmpty(data.lastName)) {
    errors.lastName = "username field is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
