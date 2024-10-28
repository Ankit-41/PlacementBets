// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return email.toLowerCase().endsWith('iitr.ac.in');
      },
      message: 'Please provide a valid IITR email'
    }
  },
  enrollmentNumber: {
    type: String,
    required: [true, 'Please provide your enrollment number'],
    unique: true,
    match: [/^\d{8}$/, 'Enrollment number must be exactly 8 digits']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  tokens: {
    type: Number,
    default: 1000 // Starting tokens for new users
  },
  activeBets: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Bet'
  }],
  expiredBets: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Bet'
  }],
  successRate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});



// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
