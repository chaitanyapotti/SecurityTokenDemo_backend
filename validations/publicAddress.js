const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validatePublicAddressInput = data => {
  let errors = {};
  data.public_address = !isEmpty(data.public_address) ? data.public_address : "";
  if (validator.isEmpty(data.public_address)) {
    errors.publicAddress = "publicAddress field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
