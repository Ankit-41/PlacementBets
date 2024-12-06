// seed/seed.js

const mongoose = require('mongoose');
const connectDB = require('./config/database'); // Adjust the path as needed
const Company = require('./models/Company'); // Adjust the path as needed
require('dotenv').config(); // Load environment variables

// Sample Data - 7 Entries
const sampleData = [
  {
    companyId: 1001,
    company: "Goldman Sachs",
    profile: "Quant",
    expiresIn: "2 days",
    totalTokenBet: 5600,
    status: "active",
    individuals: [
      {
        id: 1,
        name: "Aditya Sharma",
        enrollmentNumber: "20115001",
        forStake: 2.5,
        againstStake: 1.8,
        forTokens: 1200,
        againstTokens: 800,
        result: "awaited"
      },
      {
        id: 2,
        name: "Priya Patel",
        enrollmentNumber: "20115034",
        forStake: 2.1,
        againstStake: 2.0,
        forTokens: 900,
        againstTokens: 700,
        result: "awaited"
      },
      {
        id: 3,
        name: "Rahul Verma",
        enrollmentNumber: "20115089",
        forStake: 1.9,
        againstStake: 2.2,
        forTokens: 1100,
        againstTokens: 900,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1002,
    company: "Microsoft",
    profile: "SDE",
    expiresIn: "3 days",
    totalTokenBet: 4800,
    status: "active",
    individuals: [
      {
        id: 4,
        name: "Sneha Kumar",
        enrollmentNumber: "20115012",
        forStake: 2.8,
        againstStake: 1.6,
        forTokens: 1500,
        againstTokens: 600,
        result: "awaited"
      },
      {
        id: 5,
        name: "Arjun Singh",
        enrollmentNumber: "20115045",
        forStake: 2.3,
        againstStake: 1.9,
        forTokens: 1000,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1003,
    company: "Google",
    profile: "Product",
    expiresIn: "1 day",
    totalTokenBet: 6200,
    status: "active",
    individuals: [
      {
        id: 6,
        name: "Karan Mehra",
        enrollmentNumber: "20115067",
        forStake: 3.0,
        againstStake: 1.5,
        forTokens: 2000,
        againstTokens: 700,
        result: "awaited"
      },
      {
        id: 7,
        name: "Riya Gupta",
        enrollmentNumber: "20115023",
        forStake: 2.6,
        againstStake: 1.7,
        forTokens: 1800,
        againstTokens: 900,
        result: "awaited"
      },
      {
        id: 8,
        name: "Vikram Malhotra",
        enrollmentNumber: "20115056",
        forStake: 2.2,
        againstStake: 2.1,
        forTokens: 800,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1004,
    company: "Tower Research",
    profile: "Quant",
    expiresIn: "4 days",
    totalTokenBet: 5100,
    status: "active",
    individuals: [
      {
        id: 9,
        name: "Ishaan Joshi",
        enrollmentNumber: "20115078",
        forStake: 2.7,
        againstStake: 1.8,
        forTokens: 1600,
        againstTokens: 700,
        result: "awaited"
      },
      {
        id: 10,
        name: "Neha Reddy",
        enrollmentNumber: "20115090",
        forStake: 2.4,
        againstStake: 1.9,
        forTokens: 1400,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1005,
    company: "Amazon",
    profile: "SDE",
    expiresIn: "2 days",
    totalTokenBet: 5800,
    status: "active",
    individuals: [
      {
        id: 11,
        name: "Rohan Kapoor",
        enrollmentNumber: "20115100",
        forStake: 2.9,
        againstStake: 1.6,
        forTokens: 1900,
        againstTokens: 600,
        result: "awaited"
      },
      {
        id: 12,
        name: "Ananya Shah",
        enrollmentNumber: "20115111",
        forStake: 2.5,
        againstStake: 1.8,
        forTokens: 1300,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1006,
    company: "Intel",
    profile: "Core",
    expiresIn: "5 days",
    totalTokenBet: 4200,
    status: "active",
    individuals: [
      {
        id: 13,
        name: "Dhruv Sharma",
        enrollmentNumber: "20115122",
        forStake: 2.2,
        againstStake: 2.0,
        forTokens: 1000,
        againstTokens: 900,
        result: "awaited"
      },
      {
        id: 14,
        name: "Tanvi Mehta",
        enrollmentNumber: "20115133",
        forStake: 2.1,
        againstStake: 2.1,
        forTokens: 800,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1007,
    company: "Uber",
    profile: "Data",
    expiresIn: "3 days",
    totalTokenBet: 5300,
    status: "active",
    individuals: [
      {
        id: 15,
        name: "Aarav Kumar",
        enrollmentNumber: "20115144",
        forStake: 2.6,
        againstStake: 1.7,
        forTokens: 1700,
        againstTokens: 700,
        result: "awaited"
      },
      {
        id: 16,
        name: "Zara Sinha",
        enrollmentNumber: "20115155",
        forStake: 2.3,
        againstStake: 1.9,
        forTokens: 1200,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1008,
    company: "Samsung",
    profile: "Product",
    expiresIn: "4 days",
    totalTokenBet: 4600,
    status: "active",
    individuals: [
      {
        id: 17,
        name: "Kabir Singh",
        enrollmentNumber: "20115166",
        forStake: 2.4,
        againstStake: 1.8,
        forTokens: 1400,
        againstTokens: 700,
        result: "awaited"
      },
      {
        id: 18,
        name: "Maya Iyer",
        enrollmentNumber: "20115177",
        forStake: 2.2,
        againstStake: 2.0,
        forTokens: 1000,
        againstTokens: 900,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1009,
    company: "D.E. Shaw",
    profile: "Quant",
    expiresIn: "2 days",
    totalTokenBet: 5900,
    status: "active",
    individuals: [
      {
        id: 19,
        name: "Vivaan Khanna",
        enrollmentNumber: "20115188",
        forStake: 2.8,
        againstStake: 1.6,
        forTokens: 1800,
        againstTokens: 600,
        result: "awaited"
      },
      {
        id: 20,
        name: "Aisha Patel",
        enrollmentNumber: "20115199",
        forStake: 2.5,
        againstStake: 1.8,
        forTokens: 1500,
        againstTokens: 800,
        result: "awaited"
      }
    ]
  },
  {
    companyId: 1010,
    company: "Qualcomm",
    profile: "Core",
    expiresIn: "3 days",
    totalTokenBet: 4400,
    status: "active",
    individuals: [
      {
        id: 21,
        name: "Aryan Menon",
        enrollmentNumber: "20115210",
        forStake: 2.3,
        againstStake: 1.9,
        forTokens: 1200,
        againstTokens: 800,
        result: "awaited"
      },
      {
        id: 22,
        name: "Kyra Nair",
        enrollmentNumber: "20115221",
        forStake: 2.1,
        againstStake: 2.1,
        forTokens: 900,
        againstTokens: 900,
        result: "awaited"
      }
    ]
  }
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
