const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ROLES = ["BROKER_DEALER", "MARKET_MAKER", "INVESTOR", "ISSUER"];
const STATUS = ["APPROVED", "PENDING", "REJECTED", "PENDING_APPROVAL"];
const RESERVE_TYPE = ["REGULAR", "AUTOMATED", "LIT"];

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
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  publicAddress: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ROLES,
    default: "INVESTOR",
    required: true
  },
  status: {
    type: String,
    enum: STATUS,
    default: "PENDING",
    required: true
  },
  kycStatus: {
    type: String,
    enum: STATUS,
    default: "PENDING",
    required: true
  },
  accreditationStatus: {
    type: String,
    enum: STATUS,
    default: "PENDING",
    required: true
  },
  amlStatus: {
    type: String,
    enum: STATUS,
    default: "PENDING",
    required: true
  },
  brokerDealer: {
    type: Object,
    required: false
  },
  reserveType: {
    type: String,
    enum: RESERVE_TYPE,
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
  tokenAddress : {
    type: String,
    required: false
  }
});

module.exports = User = mongoose.model("users", UserSchema);
