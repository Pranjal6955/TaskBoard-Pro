import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  awardedAt: {
    type: Date,
    default: Date.now
  }
});

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
