// Backend: routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../controllers/authController');

// Get all active companies
router.get('/active', protect, async (req, res) => {
  try {
    const companies = await Company.find({ status: 'active' })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching active companies',
      error: error.message
    });
  }
});
// routes/companyRoutes.js
// Add this new route for creating companies
router.post('/create', protect, async (req, res) => {
  try {
    // Get the latest companyId
    const latestCompany = await Company.findOne().sort({ companyId: -1 });
    const nextCompanyId = latestCompany ? latestCompany.companyId + 1 : 1;

    // Create new company with auto-incremented companyId
    const newCompany = await Company.create({
      ...req.body,
      companyId: nextCompanyId,
      status: 'active'  // Default status
    });

    res.status(201).json({
      status: 'success',
      data: newCompany
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating company',
      error: error.message
    });
  }
});

module.exports = router;

// In your server.js or app.js, add:
