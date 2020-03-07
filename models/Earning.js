const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
  netEarning: {
    type: Number,
    default: 0
  },
  withdrawn: {
    type: Number,
    default: 0
  },
  availableForWithdrawal: {
    type: Number,
    default: 0
  },
  taskOwner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },
  referenceID: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Earning', EarningSchema);
