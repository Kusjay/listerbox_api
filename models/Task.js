const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a task name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  categories: {
    // Array of strings
    type: [String],
    require: true,
    enum: [
      'Caterer',
      'Handy Person',
      'Cleaner',
      'Laundry Person',
      'House Help',
      'Delivery Person',
      'Electrician',
      'Generator Repairer',
      'Plumber'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    type: mongoose.Schema.ObjectId,
    ref: 'Profile',
    required: true
  }
});

module.exports = mongoose.model('Task', TaskSchema);
