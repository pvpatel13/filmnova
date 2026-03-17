const express = require('express');
const { getUserProfile, updateWatchlist, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/stats', protect, getUserStats);
router.post('/watchlist', protect, updateWatchlist);

module.exports = router;
