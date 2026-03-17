const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    movieId: { type: String, required: true }, // IMDB ID
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
  },
  { timestamps: true }
);

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
