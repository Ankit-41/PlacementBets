// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorResponse } = require('./errorHandler');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user by id from decoded token
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorResponse('No user found with this id', 401));
      }

      // 4. Add user to request object
      req.user = user;
      next();
    } catch (err) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (err) {
    next(err);
  }
};