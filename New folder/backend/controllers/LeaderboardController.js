// controllers/leaderboardController.js
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name enrollmentNumber tokens successfulBets totalBets streak rankChange avatar')
      .sort({ tokens: -1 })
      .limit(100);

    // Calculate ranks and prepare response data
    const leaderboardData = users.map((user, index) => ({
      id: user._id,
      rank: index + 1,
      name: user.name,
      avatar: user.avatar,
      tokens: user.tokens,
      successfulBets: user.successfulBets,
      totalBets: user.totalBets,
      streak: user.streak,
      change: user.rankChange,
    }));

    res.status(200).json({
      status: 'success',
      data: leaderboardData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching leaderboard data'
    });
  }
};