const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const subTaskSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true
    },
    deadline: {
      type: Date
    },
    status: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const taskSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true
    },
    deadline: {
      type: Date
    },
    status: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
    subtasks: [subTaskSchema]
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tasks: [taskSchema]
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;