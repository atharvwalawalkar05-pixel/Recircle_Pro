// backend/routes/userRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires token)
router.get('/profile', protect, (req, res) => {
  // req.user is available because of the 'protect' middleware
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;