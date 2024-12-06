// config/database.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // You can add more options here if needed
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit process with failure
    });
};

module.exports = connectDB;
