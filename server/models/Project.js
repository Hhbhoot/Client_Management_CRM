const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
    },
    budget: {
      type: Number,
      required: [true, 'Please add a budget'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please add a deadline'],
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
