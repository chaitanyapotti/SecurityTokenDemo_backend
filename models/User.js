const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ROLES = ["BROKER_DEALER", "MARKET_MAKER", "INVESTOR"];
const STATUS = ["APPROVED", "PENDING", "NO"];
const RESERVE_TYPE = ["REGULAR", "AUTOMATED", "LIT"];
const KYC_STATUS = ["YES", "NO"];
const AML_STATUS = ["YES", "NO"];
const ACCREDITATION_STATUS = ["YES", "NO"];
const VERIFICATION_STATUS = ["YES", "NO"];

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
    default: "NO"
  },
  reserveType: {
    type: String,
    enum: RESERVE_TYPE,
    default: "REGULAR"
  },
  kycStatus: {
    type: String,
    enum: KYC_STATUS,
    default: "NO"
  },
  accreditationStatus: {
    type: String,
    enum: ACCREDITATION_STATUS,
    default: "NO"
  },
  amlStatus: {
    type: String,
    enum: AML_STATUS,
    default: "NO"
  },
  verificationStatus: {
    type: String,
    enum: VERIFICATION_STATUS,
    default: "NO"
  }
});

module.exports = User = mongoose.model("users", UserSchema);
