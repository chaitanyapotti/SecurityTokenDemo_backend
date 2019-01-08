const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ROLES = ["BROKER_DEALER", "MARKET_MAKER", "INVESTOR"];
const STATUS = ["YES", "NO"];

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  publicAddress: {
    type: String,
    required: false
  },
  reserveAddress: {
    type: String,
    required: false
  },
  conversionRatesAddress: {
    type: String,
    required: false
  },
  investors: {
    type: Array,
    required: false
  },
  role: {
    type: String,
    enum: ROLES,
    default: "INVESTOR"
  },
  status: {
    type: String,
    enum: STATUS,
    default: "YES"
  }
});

module.exports = User = mongoose.model("users", UserSchema);
