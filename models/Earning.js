const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
  totalEarning: {
    type: Number
  },
  taskOwner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },
  referenceID: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Earning', EarningSchema);
