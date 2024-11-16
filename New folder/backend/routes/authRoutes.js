// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();



// Send OTP email for verification
router.post('/send-otp', authController.sendOTP);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/me', authController.protect, async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;