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
  },
  User:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  Movie:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Movie"
  }
});

module.exports = mongoose.model('Review', reviewSchema);
