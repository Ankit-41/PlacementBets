// routes/individualRoutes.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Individual = require('../models/Individual');
const axios = require('axios');
const { protect } = require('../controllers/authController');

// Helper function to fetch branch information from channeli API
async function fetchStudentBranch(enrollmentNumber) {
  try {
    const response = await axios.get(`https://channeli.in/api/student_profile/profile/${enrollmentNumber}/handle/`);
    return response.data.branch;
  } catch (error) {
    console.error(`Error fetching branch for ${enrollmentNumber}:`, error);
    return null;
  }
}

// Sync individuals from companies
router.post('/sync', protect, async (req, res) => {
  try {
    // Get all companies
    const companies = await Company.find({});
    const updates = [];

    for (const company of companies) {
      for (const individual of company.individuals) {
        try {
          // Check if individual exists
          let individualDoc = await Individual.findOne({ 
            enrollmentNumber: individual.enrollmentNumber 
          });

          // If individual doesn't exist, create new entry
          if (!individualDoc) {
            // Fetch branch information
            const branch = await fetchStudentBranch(individual.enrollmentNumber);
            if (!branch) {
              console.warn(`Could not fetch branch for ${individual.enrollmentNumber}`);
              continue;
            }

            individualDoc = new Individual({
              name: individual.name,
              enrollmentNumber: individual.enrollmentNumber,
              branch: branch,
              companies: []
            });
          }

          // Check if this company is already in the individual's companies array
          const existingCompanyIndex = individualDoc.companies.findIndex(
            c => c.companyId.toString() === company._id.toString()
          );

          if (existingCompanyIndex === -1) {
            // Add new company reference
            individualDoc.companies.push({
              companyId: company._id,
              companyName: company.company,
              status: company.status,
              result: individual.result
            });
          } else {
            // Update existing company reference
            individualDoc.companies[existingCompanyIndex].status = company.status;
            individualDoc.companies[existingCompanyIndex].result = individual.result;
          }

          individualDoc.lastUpdated = new Date();
          updates.push(individualDoc.save());
        } catch (error) {
          console.error(`Error processing individual ${individual.enrollmentNumber}:`, error);
        }
      }
    }

    // Wait for all updates to complete
    await Promise.all(updates);

    res.status(200).json({
      status: 'success',
      message: 'Individual database synchronized successfully'
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get all individuals
router.get('/', protect, async (req, res) => {
  try {
    const individuals = await Individual.find()
      .sort({ lastUpdated: -1 });

    res.status(200).json({
      status: 'success',
      data: individuals
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

  // Get unique branches
  router.get('/branches', protect, async (req, res) => {
    try {
      console.log('Fetching branches...');
      
      let branches = [];
      try {
        branches = await Individual.distinct('branch');
      } catch (dbError) {
        console.error('Database error fetching branches:', dbError);
      }
      
      // If no branches found or error occurred, return default list
      if (!branches || branches.length === 0) {
        console.log('No branches found in DB, using default list');
        branches = [
          'B.Tech. (Chemical Engineering)',
          'B.Tech. (Computer Science)',
          'B.Tech. (Electronics and Communication)',
          'B.Tech. (Mechanical Engineering)',
          
        ];
      }
  
      console.log(`Returning ${branches.length} branches`);
      res.status(200).json({
        status: 'success',
        branches
      });
    } catch (error) {
      console.error('Error in /branches route:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching branches',
        error: error.message
      });
    }
  });

// Search individuals
router.get('/search', protect, async (req, res) => {
    try {
      console.log('Search params:', req.query);
      const { name,enrollmentNumber, branch } = req.query;
      let filter = {};
      if (name) {
        // Partial, case-insensitive match for names
        filter.name = new RegExp(name.trim(), 'i');
      }
      if (enrollmentNumber) {
        // query.enrollmentNumber = enrollmentNumber;
        filter.enrollmentNumber = new RegExp(`^${enrollmentNumber.trim()}`, 'i');

      }
      if (branch) {
        filter.branch = branch;
      }
  
      if (!name && !enrollmentNumber && !branch) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide either enrollment number or branch'
        });
      }
  
      console.log('Search query:', filter);
      const individuals = await Individual.find(filter)
        .select('-__v')
        .sort({ lastUpdated: -1 });
  
      console.log(`Found ${individuals.length} individuals`);
  
      if (individuals.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No individuals found matching the criteria'
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: individuals
      });
    } catch (error) {
      console.error('Error in /search route:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error searching individuals',
        error: error.message
      });
    }
  });
  
  

module.exports = router;