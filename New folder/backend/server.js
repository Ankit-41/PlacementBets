// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const betRoutes = require('./routes/betRoutes');
const leaderboardRoutes = require('./routes/LeaderboardRoutes');
const adminPanelRoutes = require('./routes/adminPanelRoutes');

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:5172', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
// const companyRoutes = require('./routes/companyRoutes');
app.use('/api/companies', companyRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Add this line with your other route middleware
app.use('/api/admin/companies', adminPanelRoutes);
// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});