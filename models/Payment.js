const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
  accessCode: {
    type: String,
    required: true
  },
  status: {
    type: [String],
    require: true,
    enum: ['Init', 'Paid', 'Cancelled'],
    required: true
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
