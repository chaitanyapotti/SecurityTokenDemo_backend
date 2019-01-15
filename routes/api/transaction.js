const express = require("express");
const router = express.Router();
const Transaction = require("../../models/Transaction");
const validateTransactionInput = require("../../validations/transaction");

function validateInputs(req, res) {
  if (!("bd_address" in req.query)) return res.status(400).json("Bad Request input");
  if (!("investor_address" in req.query)) return res.status(400).json("Bad Request input");
}

// @route POST api/transaction/
// @desc add a transaction
// @access Public

router.post("/", (req, res) => {
  const { errors, isValid } = validateTransactionInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Transaction.findOne({ transaction_hash: req.body.transactionHash })
    .then(transaction => {
      if (transaction) {
        errors.transactionHash = " transaction already exists";
        return res.status(400).json(errors);
      } else {
        const newTransaction = new Transaction({
          token_address: req.body.tokenAddress,
          transaction_type: req.body.transactionType,
          transaction_hash: req.body.transactionHash,
          bd_address: req.body.bdAddress,
          token_count: req.body.tokenCount,
          investor_address: req.body.investorAddress
        });
        newTransaction
          .save()
          .then(transaction => res.status(200).json(transaction))
          .catch(err => {
            console.log(err);
            return res.status(500).json({});
          });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({});
    });
});

router.get("/", (req, res) => {
  validateInputs(req, res);
  Transaction.find({ bd_address: req.query.bd_address, investor_address: req.query.investor_address })
    .then(transactions => {
      return res.status(200).send(transactions);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ errors: err });
    });
});

module.exports = router;
