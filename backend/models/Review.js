const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    movieId: { type: String, required: true }, // IMDB ID
    reviewText: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
