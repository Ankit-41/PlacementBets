// Backend: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bet = require('../models/Bet');
const ExpiredBet=require('../models/ExpiredBet');
const { protect } = require('../controllers/authController');

// Get user profile
router.get('/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's bets
router.get('/:userId/bets', protect, async (req, res) => {
 
  try {
    // Get active bets from Bet model
    const activeBets = await Bet.find({ bettorId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get expired bets from ExpiredBet model
    const expiredBets = await ExpiredBet.find({ bettorId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Combine and format both sets of bets
    const bets = [
      ...activeBets.map(bet => ({ ...bet, status: 'active' })),
      ...expiredBets.map(bet => ({ ...bet, status: 'expired' }))
    ].sort((a, b) => b.createdAt - a.createdAt); // Sort all bets by date

    res.status(200).json({
      status: 'success',
      data: bets
    });
  } catch (error) {
    next(new ErrorResponse(error.message || 'Error fetching bets', 500));
  }


});

module.exports = router;

