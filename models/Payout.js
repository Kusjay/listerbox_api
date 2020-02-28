const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.ObjectId,
    ref: "Task",
    required: true
  },
  refereneID: {
    type: String,
    required: true
  },
  taskOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: [String],
    require: true,
    enum: ["Pending", "Paid", "Rejected"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payout", PayoutSchema);
