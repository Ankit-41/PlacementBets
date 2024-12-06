// models/Bet.js
const mongoose = require('mongoose');

const ExpiredBetSchema = new mongoose.Schema({
  bettorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bettor ID is required']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  company:{
    type:'string',
    required:[true, 'Company name is required']
  },
  targetUserId: {
    type: Number,
    required: [true, 'Target user ID is required']
  },
  targetUserName: {
    type: String,
    required: [true, 'Target user name is required']
  },
  targetUserEnrollment: {
    type: String,
    required: [true, 'Target user enrollment number is required']
  },
  betType: {
    type: String,
    enum: ['for', 'against'],
    required: [true, 'Bet type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Bet amount is required'],
    min: [1, 'Minimum bet amount is 1']
  },
  stake: {
    type: Number,
    required: [true, 'Stake multiplier is required'],
    min: [0, 'Stake cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'won', 'lost'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add index for better query performance
ExpiredBetSchema.index({ bettorId: 1, status: 1 });
ExpiredBetSchema.index({ companyId: 1, status: 1 });

module.exports = mongoose.model('ExpiredBet', ExpiredBetSchema);