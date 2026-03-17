const User = require('../models/User');
const Rating = require('../models/Rating');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      watchlist: user.watchlist,
      favoriteGenres: user.favoriteGenres,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update watchlist
// @route   POST /api/users/watchlist
// @access  Private
const updateWatchlist = async (req, res) => {
  const { movieId, action } = req.body; // action: 'add' or 'remove'
  const user = await User.findById(req.user._id);

  if (user) {
    if (action === 'add') {
      if (!user.watchlist.includes(movieId)) {
        user.watchlist.push(movieId);
      }
    } else {
      user.watchlist = user.watchlist.filter((id) => id !== movieId);
    }
    await user.save();
    res.json(user.watchlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user stats and rating history
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  const ratings = await Rating.find({ userId: req.user._id }).sort({ createdAt: -1 });
  
  const reviewCount = ratings.length;
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((acc, item) => item.rating + acc, 0) / ratings.length).toFixed(1)
    : 0;

  res.json({
    reviewCount,
    averageRating,
    ratings
  });
};

module.exports = { getUserProfile, updateWatchlist, getUserStats };
