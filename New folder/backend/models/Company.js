// models/Company.js
const mongoose = require('mongoose');

const individualSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true
  },
  enrollmentNumber: {
    type: String,
    required: true
  },
  forStake: {
    type: Number,
    required: true,
    min: 0
  },
  againstStake: {
    type: Number,
    required: true,
    min: 0
  },
  forTokens: {
    type: Number,
    default: 0,
    min: 0
  },
  againstTokens: {
    type: Number,
    default: 0,
    min: 0
  },
  result:{
    type:String,
     enum: ['awaited', 'won','lost'],
    default: 'awaited'

  }
});

const companySchema = new mongoose.Schema({
  companyId: {
    type: Number,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true
  },
  profile:{
    type:String,
    required:true
  },
  expiresIn: {
    type: String,
    required: true
  },
  totalTokenBet: {
    type: Number,
    required: true,
    default: 0
  },
  individuals: [individualSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  logo:{
    type:String,
    default:"https://cdn2.hubspot.net/hubfs/53/image8-2.jpg"
  },
  status: {
    type: String,
    enum: ['active', 'expired','pending'],
    default: 'active'
  }
});

// Add indexes for better query performance
companySchema.index({ companyId: 1 });
companySchema.index({ status: 1 });
companySchema.index({ createdAt: 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;