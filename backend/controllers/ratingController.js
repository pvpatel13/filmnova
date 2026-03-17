const Rating = require('../models/Rating');
const Review = require('../models/Review');

// @desc    Rate a movie
// @route   POST /api/ratings
// @access  Private
const rateMovie = async (req, res) => {
  const { movieId, rating, review } = req.body;

  const existingRating = await Rating.findOne({ userId: req.user._id, movieId });

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
    await existingRating.save();
    return res.json(existingRating);
  }

  const newRating = await Rating.create({
    userId: req.user._id,
    movieId,
    rating,
    review,
  });

  res.status(201).json(newRating);
};

// @desc    Get movie ratings & average
// @route   GET /api/ratings/:movieId
// @access  Public
const getMovieRatings = async (req, res) => {
  const ratings = await Rating.find({ movieId: req.params.movieId }).populate('userId', 'name avatar');
  const count = ratings.length;
  const average = count > 0 ? ratings.reduce((acc, item) => item.rating + acc, 0) / count : 0;

  res.json({ ratings, count, average });
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  const { movieId, reviewText } = req.body;

  const review = await Review.create({
    userId: req.user._id,
    movieId,
    reviewText,
  });

  res.status(201).json(review);
};

// @desc    Get movie reviews
// @route   GET /api/reviews/:movieId
// @access  Public
const getMovieReviews = async (req, res) => {
  const reviews = await Review.find({ movieId: req.params.movieId }).populate('userId', 'name avatar');
  res.json(reviews);
};

module.exports = { rateMovie, getMovieRatings, addReview, getMovieReviews };
