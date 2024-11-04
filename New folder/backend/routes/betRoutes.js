// routes/betRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');
const Bet = require('../models/Bet');
const User = require('../models/User');
const Company = require('../models/Company');
const calculateStakes = require('../utils/stakeCalculator');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get user's bets
router.get('/my-bets', protect, async (req, res, next) => {
  try {
    const bets = await Bet.find({ bettorId: req.user._id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .lean(); // Use lean for better performance since we don't need Mongoose document features

    if (!bets) {
      return next(new ErrorResponse('No bets found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: bets
    });
  } catch (error) {
    next(new ErrorResponse(error.message || 'Error fetching bets', 500));
  }
});

// Place bets route with stake updates
router.post('/place-bets', protect, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { companyId, bets } = req.body;
console.log(bets);
console.log(companyId);
    // Validate request data
    if (!companyId || !bets || !Array.isArray(bets) || bets.length === 0) {
      return next(new ErrorResponse('Invalid request data', 400));
    }

    // Find company and verify it exists
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new ErrorResponse('Company not found', 404));
    }

    // Calculate total bet amount
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

    // Verify user has enough tokens
    const user = await User.findById(req.user._id).session(session);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    if (user.tokens < totalBetAmount) {
      return next(new ErrorResponse('Insufficient tokens', 400));
    }

    // Process bets and update stakes
    for (const bet of bets) {
      const userIndex = company.individuals.findIndex(
        ind => ind.id.toString() === bet.targetUserId.toString()
      );

      if (userIndex === -1) {
        throw new Error(`Target user ${bet.targetUserId} not found in company`);
      }

      // Update tokens for the user
      if (bet.betType === 'for') {
        company.individuals[userIndex].forTokens += bet.amount;
      } else {
        company.individuals[userIndex].againstTokens += bet.amount;
      }

      // Calculate and update stakes
      const { forStake, againstStake } = calculateStakes(
        company.individuals[userIndex].forTokens,
        company.individuals[userIndex].againstTokens
      );

      // Update stakes
      company.individuals[userIndex].forStake = forStake;
      company.individuals[userIndex].againstStake = againstStake;
    }

    // Update company's total token bet
    company.totalTokenBet += totalBetAmount;

    // Save company changes
    await company.save({ session });

    // Create bet records
    const createdBets = await Promise.all(bets.map(bet => {
      const targetUser = company.individuals.find(
        ind => ind.id.toString() === bet.targetUserId.toString()
      );

      return new Bet({
        bettorId: req.user._id,
        companyId,
        company:company.company,
        targetUserId: bet.targetUserId,
        targetUserName: bet.targetUserName,
        targetUserEnrollment: bet.targetUserEnrollment,
        betType: bet.betType,
        amount: bet.amount,
        stake: bet.betType === 'for' ? targetUser.forStake : targetUser.againstStake
      }).save({ session });
    }));

    // Update user's token balance
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { tokens: -totalBetAmount } },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    // Send response
    res.status(201).json({
      status: 'success',
      data: {
        bets: createdBets,
        totalBetAmount,
        updatedCompany: company
      }
    });
  } catch (error) {
    await session.abortTransaction();
    next(new ErrorResponse(error.message || 'Error placing bets', 500));
  } finally {
    session.endSession();
  }
});

// Add a utility endpoint to recalculate all stakes for a company
router.post('/recalculate-stakes/:companyId', protect, async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return next(new ErrorResponse('Company not found', 404));
    }

    // Recalculate stakes for all individuals
    company.individuals = company.individuals.map(individual => {
      const { forStake, againstStake } = calculateStakes(
        individual.forTokens,
        individual.againstTokens
      );

      individual.forStake = forStake;
      individual.againstStake = againstStake;
      return individual;
    });

    await company.save();

    res.status(200).json({
      status: 'success',
      data: {
        company
      }
    });
  } catch (error) {
    next(new ErrorResponse(error.message || 'Error recalculating stakes', 500));
  }
});

module.exports = router;