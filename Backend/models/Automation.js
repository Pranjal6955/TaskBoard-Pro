const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  triggerType: {
    type: String,
    required: true,
    enum: ['task_status_changed', 'task_assigned', 'task_due_date_passed', 'task_created']
  },
  condition: {
    field: String,
    operator: {
      type: String,
      enum: ['equals', 'not_equals', 'contains', 'not_contains']
    },
    value: mongoose.Schema.Types.Mixed
  },
  action: {
    type: {
      type: String,
      required: true,
      enum: ['change_status', 'assign_badge', 'send_notification', 'assign_user']
    },
    value: mongoose.Schema.Types.Mixed
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Automation', automationSchema);
