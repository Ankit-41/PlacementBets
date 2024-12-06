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
    default: 100000 // Starting tokens for new users
  },
 wonBets:{
  type:Number,
  default:0
 },
 lostBets:{
  type:Number,
  default:0
 },
 streak:{
  type:Number,
  default:0
 },
  successRate: {
    type: Number,
    default: 0
  },
  role:{
    type:String,
    enum: ['admin', 'member','editor'],
    default:'member'
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
