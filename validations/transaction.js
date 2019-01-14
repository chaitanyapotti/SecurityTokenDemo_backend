const validator = require("validator");
const isEmpty = require("./is-Empty");

module.exports = validateTransactionInput = data => {
  let errors = {};
  data.tokenAddress = !isEmpty(data.tokenAddress) ? data.tokenAddress : "";
  data.transactionType = !isEmpty(data.transactionType) ? data.transactionType : "";
  data.transactionHash = !isEmpty(data.transactionHash) ? data.transactionHash : "";
  data.bdAddress = !isEmpty(data.bdAddress) ? data.bdAddress : "";
  data.tokenCount = !isEmpty(data.tokenCount) ? data.tokenCount : "";
  data.investorAddress = !isEmpty(data.investorAddress) ? data.investorAddress : "";

  if (validator.isEmpty(data.tokenAddress)) {
    errors.tokenAddress = "token address field is required";
  }

  if (validator.isEmpty(data.transactionType)) {
    errors.transactionType = "transaction type field is required";
  }

  if (validator.isEmpty(data.transactionHash)) {
    errors.transactionHash = "transaction hash field is required";
  }

  if (validator.isEmpty(data.bdAddress)) {
    errors.bdAddress = "bd address field is required";
  }

  if (validator.isEmpty(data.tokenCount)) {
    errors.tokenCount = "token count field is required";
  }

  if (validator.isEmpty(data.investorAddress)) {
    errors.investorAddress = "investor address field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
