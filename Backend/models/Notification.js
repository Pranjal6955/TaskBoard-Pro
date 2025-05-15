const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['task', 'project', 'automation', 'system'],
    default: 'system'
  },
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId
  },
  relatedItemType: {
    type: String,
    enum: ['Task', 'Project', 'User']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
