const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, currentPassword, newPassword, weddingDate, venue, expectedGuests } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If current password is provided, verify it before updating
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      // If new password is provided, hash it
      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }
    }

    // Update user fields
    user.name = name;
    user.email = email;
    if (weddingDate) user.weddingDate = weddingDate;
    if (venue) user.venue = venue;
    if (expectedGuests) user.expectedGuests = expectedGuests;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;