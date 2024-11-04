// controllers/betController.js
const Bet = require('../models/Bet');
const User = require('../models/User');
const Company = require('../models/Company');
const { ErrorResponse } = require('../middleware/errorHandler');

exports.processBetResult = async (companyId, selectedUsers) => {
  try {
    // Find all active bets for this company
    const bets = await Bet.find({
      companyId,
      status: 'active'
    });

    // Process each bet
    for (const bet of bets) {
      const isSelected = selectedUsers.includes(bet.targetUserId);
      let betWon = false;

      // Determine if bet is won based on bet type and selection
      if (bet.betType === 'for') {
        betWon = isSelected;
      } else { // against
        betWon = !isSelected;
      }

      // Calculate payout
      const payout = betWon ? bet.potentialPayout : 0;

      // Update bet status and payout
      bet.status = betWon ? 'won' : 'lost';
      bet.result = isSelected ? 'selected' : 'not_selected';
      bet.payoutAmount = payout;
      await bet.save();

      // Update user tokens if bet is won
      if (betWon) {
        await User.findByIdAndUpdate(bet.bettorId, {
          $inc: { tokens: payout }
        });
      }

      // Update user's bet statistics
      await User.findByIdAndUpdate(bet.bettorId, {
        $inc: {
          totalBets: 1,
          successfulBets: betWon ? 1 : 0
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error processing bet results:', error);
    throw new ErrorResponse('Error processing bet results', 500);
  }
};

exports.validateBets = async (bets, user) => {
  // Calculate total bet amount
  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  // Check if user has enough tokens
  if (user.tokens < totalAmount) {
    throw new ErrorResponse('Insufficient tokens', 400);
  }

  // Check betting limits (e.g., maximum bet per user)
  const maxBetPerUser = 1000; // Adjust as needed
  for (const bet of bets) {
    if (bet.amount > maxBetPerUser) {
      throw new ErrorResponse(`Maximum bet amount per user is ${maxBetPerUser} tokens`, 400);
    }
  }

  return true;
};

exports.getBetStatistics = async (userId) => {
  const stats = await Bet.aggregate([
    {
      $match: { bettorId: userId }
    },
    {
      $group: {
        _id: null,
        totalBets: { $sum: 1 },
        totalWagered: { $sum: '$amount' },
        totalWon: {
          $sum: {
            $cond: [{ $eq: ['$status', 'won'] }, '$payoutAmount', 0]
          }
        },
        totalLost: {
          $sum: {
            $cond: [{ $eq: ['$status', 'lost'] }, '$amount', 0]
          }
        },
        winCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'won'] }, 1, 0]
          }
        },
        lossCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'lost'] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalBets: 1,
        totalWagered: 1,
        totalWon: 1,
        totalLost: 1,
        winRate: {
          $multiply: [
            { $divide: ['$winCount', { $add: ['$winCount', '$lossCount'] }] },
            100
          ]
        },
        roi: {
          $multiply: [
            {
              $divide: [
                { $subtract: ['$totalWon', '$totalWagered'] },
                '$totalWagered'
              ]
            },
            100
          ]
        }
      }
    }
  ]);

  return stats[0] || null;
};