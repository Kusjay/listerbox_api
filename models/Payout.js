const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true
  },
  referenceID: {
    type: String,
    required: true
  },
  taskOwner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: [String],
    require: true,
    enum: ['Init', 'Paid', 'Rejected'],
    default: 'Init'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payout', PayoutSchema);
