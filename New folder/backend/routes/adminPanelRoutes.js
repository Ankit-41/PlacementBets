// routes/adminPanelRoutes.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Bet = require('../models/Bet');
const User = require('../models/User');
const { protect } = require('../controllers/authController');

// Debug middleware
router.use((req, res, next) => {
  console.log('Admin Route accessed:', {
    method: req.method,
    url: req.url,
    params: req.params,
    body: req.body
  });
  next();
});

// Helper function to process individual bet
async function processIndividualBet(bet, company) {
  try {
    const individual = company.individuals.find(ind => ind.id === bet.targetUserId);
    if (!individual) return;

    const winningAmount = Math.floor(bet.amount * bet.stake);

    if (individual.result === 'won') {
      if (bet.betType === 'for') {
        bet.status = 'won';
        await User.findByIdAndUpdate(
          bet.bettorId,
          { $inc: { tokens: winningAmount } }
        );
      } else {
        bet.status = 'lost';
      }
    } else if (individual.result === 'lost') {
      if (bet.betType === 'against') {
        bet.status = 'won';
        await User.findByIdAndUpdate(
          bet.bettorId,
          { $inc: { tokens: winningAmount } }
        );
      } else {
        bet.status = 'lost';
      }
    }

    await bet.save();
  } catch (error) {
    console.error('Error processing individual bet:', error);
    throw error;
  }
}

// Update company status
router.put('/:companyId/status', protect, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.body;

    console.log('Updating company status:', { companyId, status });

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    company.status = status;
    await company.save();

    // If company is marked as expired, process all active bets
    if (status === 'expired') {
      const bets = await Bet.find({ 
        companyId: companyId,
        status: 'active'
      });

      for (const bet of bets) {
        await processIndividualBet(bet, company);
      }
    }

    res.status(200).json({
      status: 'success',
      data: { company }
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update individual result
router.put('/:companyId/individuals/:individualId/result', protect, async (req, res) => {
  try {
    const { companyId, individualId } = req.params;
    const { result } = req.body;

    console.log('Updating individual result:', { companyId, individualId, result });

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    // Find individual by ID (considering it might be a number)
    const individual = company.individuals.find(ind => ind.id.toString() === individualId.toString());
    if (!individual) {
      return res.status(404).json({
        status: 'error',
        message: 'Individual not found'
      });
    }

    individual.result = result;
    await company.save();

    // Process bets for this individual
    const bets = await Bet.find({
      companyId: companyId,
      targetUserId: parseInt(individualId),
      status: 'active'
    });

    for (const bet of bets) {
      await processIndividualBet(bet, company);
    }

    res.status(200).json({
      status: 'success',
      data: { company }
    });
  } catch (error) {
    console.error('Error updating individual result:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get all companies
router.get('/', protect, async (req, res) => {
  try {
    const companies = await Company.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: companies
    });
  } catch (error) {
    console.error('Error getting companies:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;