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
  rating:{
    type: Number,
    required: true
  },
  actors: {
    type: [String],
    required: true
  },
  description:{
    type: String,
  },
  actor_facets: {
    type: [String],
  },
  price: {
    type: Number,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  trailer: {
    type: String,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
