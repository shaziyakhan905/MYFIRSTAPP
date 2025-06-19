const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// LOGIN controller
const loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find user by email
    const user = await User.findOne({ emailId: emailId.toLowerCase() });

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id,
       emailId: user.emailId,
       roles: user.roles
       },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ status: 'success', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
 
//refresh toket api
const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  try {
     if (!refreshToken) {
    return res.status(401).json({ status: 'fail', message: 'Refresh token missing' });
  }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h'}
    );

    res.json({ status: 'success', accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ status: 'fail', message: 'Invalid or expired refresh token' });
  }
};

// create user
const createUser = async (req, res, next) => {
  try {
    let { firstName, lastName, emailId, password, mobileNo, countryId, stateId, cityId, roles } = req.body;

    emailId = emailId.toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send({ status: 'fail', message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ 
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      mobileNo,
      countryId: new mongoose.Types.ObjectId(countryId),
      stateId: new mongoose.Types.ObjectId(stateId),
      cityId: new mongoose.Types.ObjectId(cityId),
      roles // <- this sets the role directly
    });

    return res.status(201).send({ status: 'success', user });
  } catch (error) {
    return res.status(500).send({ status: 'error', message: error.message });
  }
};

module.exports = {
     loginUser,
    createUser,
    refresh
 };