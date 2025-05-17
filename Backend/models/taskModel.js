import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
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
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'To Do',
    enum: ['To Do', 'In Progress', 'Done']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignee: {
    userId: {
      type: String,
      ref: 'User'
    },
    email: {
      type: String
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    }
  },
  labels: [{
    type: String,
    trim: true,
    enum: ['design', 'development', 'marketing', 'research', 'testing', 'planning', 'ui/ux', 'backend', 'frontend']
  }],
  dueDate: {
    type: Date
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
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

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
