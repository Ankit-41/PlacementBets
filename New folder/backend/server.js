// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const betRoutes = require('./routes/betRoutes.js');
const leaderboardRoutes = require('./routes/LeaderboardRoutes');
const userProfileRoutes= require('./routes/userProfileRoutes.js')
const adminPanelRoutes = require('./routes/adminPanelRoutes');
const individualRoutes = require('./routes/individualRoutes.js');
const {
  globalLimiter,
  authLimiter,
  apiLimiter,
  adminLimiter
} = require('./middleware/rateLimiter.js');

const app = express();

// Enable CORS with credentials
app.use(cors({
  // origin: 'http://localhost:5172', // Your frontend URL
  // origin: 'https://jobjinx.vercel.app', // Your frontend URL
  origin:  'https://placestats.vercel.app', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Apply global rate limiter
app.use(globalLimiter);
// Connect to MongoDB
connectDB();

// Routes
// Routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/companies', apiLimiter, companyRoutes);
app.use('/api/bets', apiLimiter, betRoutes);
app.use('/api/leaderboard', apiLimiter, leaderboardRoutes);
app.use('/api/users', apiLimiter, userProfileRoutes);
app.use('/api/admin/companies', adminLimiter, adminPanelRoutes);
app.use('/api/individuals', apiLimiter, individualRoutes);
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


