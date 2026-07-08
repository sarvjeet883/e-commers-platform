const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route  POST /signup
// @desc   Register a new user
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    await User.create({ name, email, password }); // hashing happens in the model

    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  POST /login
// @desc   Authenticate user and return a JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /profile
// @desc   Return the logged-in user's profile (protected)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, getProfile };
