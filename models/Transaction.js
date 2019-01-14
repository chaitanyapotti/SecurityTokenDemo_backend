const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TRANSACTION_TYPE = ["BUY", "SELL"];

const TransactionSchema = new Schema({
  token_address: {
    type: String,
    required: true
  },
  transaction_type: {
    type: String,
    enum: TRANSACTION_TYPE
  },
  transaction_hash: {
    type: String,
    required: true
  },
  bd_address: {
    type: String,
    required: true
  },
  token_count: {
    type: String,
    required: true
  },
  investor_address: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model("transactions", TransactionSchema);
