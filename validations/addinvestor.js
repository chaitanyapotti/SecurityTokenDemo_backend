const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validateAddInvestorInput = data => {
  let errors = {};
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.contact = !isEmpty(data.contact) ? data.contact : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!validator.isNumeric(data.contact) && data.contact.length <= 6) {
    errors.contact = "Contact number is invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
