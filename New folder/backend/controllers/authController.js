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
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
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

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token or token expired'
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