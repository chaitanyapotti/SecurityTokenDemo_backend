const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ROLES = ["BROKER_DEALER", "MARKET_MAKER", "INVESTOR"];

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
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ROLES,
    default: "INVESTOR"
  }
});

module.exports = User = mongoose.model("users", UserSchema);
