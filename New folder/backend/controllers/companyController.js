// controllers/companyContrller.js

const Company =require('../models/Company');

exports.companylist= async (req, res) => {
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
  };