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

module.exports = router;

// In your server.js or app.js, add:
