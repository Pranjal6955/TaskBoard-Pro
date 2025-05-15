const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member'
    },
    email: String,
    name: String
  }],
  statuses: {
    type: [String],
    default: ['To Do', 'In Progress', 'Done']
  },
  pendingInvites: [{
    email: String,
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member'
    },
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d' // Invitation expires after 7 days
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
