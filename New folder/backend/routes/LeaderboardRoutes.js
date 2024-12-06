// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../controllers/authController');

// Get leaderboard data
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({}, {
      name: 1,
      tokens: 1,
      wonBets: 1,
      lostBets: 1,
      streak: 1,
      successRate: 1,
      enrollmentNumber: 1,
      role:1
    }).sort({ tokens: -1 }); // Sort by tokens in descending order

    const leaderboardData = users.map(user => ({
      id: user._id,
      name: user.name,
      tokens: user.tokens,
      successfulBets: user.wonBets,
      totalBets: user.wonBets + user.lostBets,
      streak: user.streak,
      enrollmentNumber: user.enrollmentNumber,
      role:user.role
    }));

    res.status(200).json({
      status: 'success',
      data: leaderboardData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching leaderboard data',
      error: error.message
    });
  }
});

// Get leaderboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalBets: { 
            $sum: { $add: ['$wonBets', '$lostBets'] } 
          },
          totalTokens: { $sum: '$tokens' },
          avgSuccessRate: { $avg: '$successRate' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching leaderboard statistics',
      error: error.message
    });
  }
});

module.exports = router;