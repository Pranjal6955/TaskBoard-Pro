import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  badges: {
    total: {
      type: Number,
      default: 0
    },
    types: {
      taskMaster: {
        type: Number,
        default: 0
      },
      problemSolver: {
        type: Number,
        default: 0
      },
      teamPlayer: {
        type: Number,
        default: 0
      },
      productivityStar: {
        type: Number,
        default: 0
      },
      fastCompleter: {
        type: Number,
        default: 0
      }
    }
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add some debugging to track when users are saved
userSchema.post('save', function(doc) {
  console.log(`User saved successfully: ${doc.email} (${doc.uid})`);
});

const User = mongoose.model('User', userSchema);

export default User;
