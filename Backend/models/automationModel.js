import mongoose from 'mongoose';

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
  trigger: {
    type: {
      type: String,
      required: true,
      enum: ['STATUS_CHANGE', 'ASSIGNMENT_CHANGE', 'DUE_DATE_PASSED']
    },
    // For STATUS_CHANGE
    fromStatus: String,
    toStatus: String,
    // For ASSIGNMENT_CHANGE
    assigneeId: String,
    assigneeEmail: String,
    // For DUE_DATE_PASSED
    // No additional fields needed
  },
  action: {
    type: {
      type: String,
      required: true,
      enum: ['ASSIGN_BADGE', 'MOVE_TASK', 'SEND_NOTIFICATION']
    },
    // For ASSIGN_BADGE
    badgeName: String,
    // For MOVE_TASK
    targetStatus: String,
    // For SEND_NOTIFICATION
    notificationText: String,
    notifyAssignee: {
      type: Boolean,
      default: true
    },
    notifyCreator: {
      type: Boolean,
      default: false
    },
    notifyProjectOwners: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
automationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Automation = mongoose.model('Automation', automationSchema);

export default Automation;
