const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscribeSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

module.exports = Subscribe = mongoose.model("subscribers", SubscribeSchema);
