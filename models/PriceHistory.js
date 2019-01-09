const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TICKERS = ["LMD", "RIV"];

const PriceHistorySchema = new Schema({
  ticker: {
    type: String,
    enum: TICKERS
  },
  current_price: {
    type: Number,
    required: true
  },
  last_price: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  token_address: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model("prices", PriceHistorySchema);
