// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Send JWT token in response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // Remove password from output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
// controllers/authController.js
exports.signup = async (req, res, next) => {
  try {
    console.log('Signup request body:', req.body); // Debug log
    
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      enrollmentNumber: req.body.enrollmentNumber,
      password: req.body.password
    });

    console.log('User created:', newUser); // Debug log
    
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('Signup error:', error); // Debug log
    
    let errorMessage = error.message;
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      errorMessage = messages.join(', ');
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      errorMessage = `This ${field} is already registered`;
    }

    res.status(400).json({
      status: 'fail',
      message: errorMessage
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log('Login request body:', req.body); // Debug log
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No'); // Debug log

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error); // Debug log
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  
  // 1) Getting token and check if it's there
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  try {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token or session expired'
    });
  }
};
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};


// controllers/authController.js

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate IITR email
    if (!email.toLowerCase().endsWith('iitr.ac.in')) {
      return res.status(400).json({
        status: 'error',
        message: 'Please use an IITR email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with timestamp (expire after 10 minutes)
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'JobJinx Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">JobJinx Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #10B981; font-size: 32px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP'
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({
        status: 'error',
        message: 'No OTP found for this email. Please request a new one.'
      });
    }

    // Check if OTP is expired (10 minutes)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      otpStore.delete(email);
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Increment attempts
    storedData.attempts += 1;

    // Check maximum attempts (3)
    if (storedData.attempts > 3) {
      otpStore.delete(email);
      return res.status(400).json({
        status: 'error',
        message: 'Too many attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP'
      });
    }

    // OTP verified successfully
    otpStore.delete(email);
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify OTP'
    });
  }
};