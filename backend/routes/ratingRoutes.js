const express = require('express');
const { rateMovie, getMovieRatings, addReview, getMovieReviews } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, rateMovie);
router.route('/:movieId').get(getMovieRatings);
router.route('/review').post(protect, addReview);
router.route('/review/:movieId').get(getMovieReviews);

module.exports = router;
