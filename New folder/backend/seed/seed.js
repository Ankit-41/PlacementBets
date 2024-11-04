// seed/seed.js

const mongoose = require('mongoose');
const connectDB = require('./config/database'); // Adjust the path as needed
const Company = require('./models/Company'); // Adjust the path as needed
require('dotenv').config(); // Load environment variables

// Sample Data - 7 Entries
const sampleData = [
  {
    companyId: 1,
    company: "TechCorp",
    expiresIn: "2d 5h",
    totalTokenBet: 3000,
    individuals: [
      { id: 1, name: "Kushagra Pandey", enrollmentNumber: "21112068", forStake: 1.5, againstStake: 1.3, forTokens: 300, againstTokens: 700 },
      { id: 2, name: "Bob Smith", enrollmentNumber: "21112060", forStake: 1.8, againstStake: 1.3, forTokens: 800, againstTokens: 200 },
      { id: 3, name: "Charlie Brown", enrollmentNumber: "EN003", forStake: 2.0, againstStake: 1.4, forTokens: 350, againstTokens: 500 },
      { id: 4, name: "David Lee", enrollmentNumber: "EN004", forStake: 1.7, againstStake: 1.8, forTokens: 600, againstTokens: 400 },
      { id: 5, name: "Eve Taylor", enrollmentNumber: "EN005", forStake: 1.9, againstStake: 2.3, forTokens: 100, againstTokens: 900 }
    ]
  },

];

const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    // Insert sample data with unordered option to continue on errors
    await Company.insertMany(sampleData, { ordered: false });
    console.log('Sample data inserted (duplicates may have been skipped)');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    if (err.name === 'BulkWriteError') {
      console.warn('Some duplicates were skipped:', err.writeErrors.map(e => e.errmsg));
    } else {
      console.error('Error seeding database:', err);
      process.exit(1);
    }
  }
};

seedDatabase();
