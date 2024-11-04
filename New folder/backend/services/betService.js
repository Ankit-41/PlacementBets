// services/betService.js
const Bet = require('../models/Bet');
const ExpiredBet = require('../models/ExpiredBet');
const User = require('../models/User');

const transferAndUpdateBets = async (bet, result) => {
  try {
    // Create a new expired bet document
    const expiredBet = new ExpiredBet({
      bettorId: bet.bettorId,
      companyId: bet.companyId,
      company: bet.company,
      targetUserId: bet.targetUserId,
      targetUserName: bet.targetUserName,
      targetUserEnrollment: bet.targetUserEnrollment,
      betType: bet.betType,
      amount: bet.amount,
      stake: bet.stake,
      status: bet.status
    });

    // Save the expired bet
    await expiredBet.save();

    // Delete the original bet
    await Bet.findByIdAndDelete(bet._id);

    // Update user statistics
    const user = await User.findById(bet.bettorId);
    if (!user) {
      throw new Error('User not found');
    }

    if (bet.status === 'won') {
      user.wonBets += 1;
      user.streak += 1;
    } else if (bet.status === 'lost') {
      user.lostBets += 1;
      user.streak = 0;
    }

    // Calculate success rate
    const totalBets = user.wonBets + user.lostBets;
    user.successRate = totalBets > 0 ? (user.wonBets / totalBets) * 100 : 0;

    await user.save();

    return { success: true };
  } catch (error) {
    console.error('Error in transferAndUpdateBets:', error);
    throw error;
  }
};

module.exports = {
  transferAndUpdateBets
};