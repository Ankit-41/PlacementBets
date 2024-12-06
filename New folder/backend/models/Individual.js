// models/Individual.js
const mongoose = require('mongoose');

const companyReferenceSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    required: true
  },
  result: {
    type: String,
    enum: ['awaited', 'won', 'lost'],
    default: 'awaited'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const individualSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  companies: [companyReferenceSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
individualSchema.index({ enrollmentNumber: 1 });
individualSchema.index({ branch: 1 });

const Individual = mongoose.model('Individual', individualSchema);

module.exports = Individual;