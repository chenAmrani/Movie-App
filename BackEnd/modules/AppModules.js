const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  actors: {
    type: [String],
    required: true
  },
  actors_facets: {
    type: [String],
  },
  description:{
    type: String,
  },
  genre: {
    type: [String],
    required: true
  },
  trailer: {
    type: String,
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
  ]
});

module.exports = mongoose.model('Movie', movieSchema);
