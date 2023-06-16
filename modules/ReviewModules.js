const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  starRank: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Review', reviewSchema);
