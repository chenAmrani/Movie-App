const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  text: {
    type: String,
    required: true
  },
  movieId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Movie"
  },
});

module.exports = mongoose.model('Review', reviewSchema);
