const mongoose = require("mongoose");

const EarningSchema = new mongoose.Schema({
  amount: {
    type: Number
  },
  taskOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Earning", EarningSchema);
