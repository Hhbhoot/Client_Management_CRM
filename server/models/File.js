const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    format: {
      type: String,
    },
    size: {
      type: Number, // in bytes
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('File', fileSchema);
