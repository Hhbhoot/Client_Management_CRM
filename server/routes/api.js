const express = require('express');
const router = express.Router();

// @desc    Test API route
// @route   GET /api/test
router.get('/test', (req, res) => {
  res.json({ message: 'API is running successfully!' });
});

module.exports = router;
