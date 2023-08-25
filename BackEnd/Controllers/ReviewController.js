const ReviewModel = require("../Models/reviewModel");
const User=require("../Models/userModel")
const Movie=require("../Models/movieModel")

module.exports.getObject = async (req, res) => {
  const Review = await ReviewModel.find();
  res.send(Review);
}

//add Review
module.exports.addObject = async (req, res) => {
  const {name, date, text, starRank, movieId, userId} = req.body
  try{
    const movie= await Movie.findById(movieId);
    const user= await User.findById(userId);
    const newReview=new ReviewModel({ name, date, text, starRank,movieId,userId });
    const savedReview=await newReview.save();
    
    movie.reviews.push(savedReview._id);
    const changedMovie=await Movie.findByIdAndUpdate(movie._id,movie);
    res.send(savedReview);
  } catch (err) {
    console.error(err);
  }
}

module.exports.updateObject = async (req, res) => {
  const { _id, name, date, text, starRank} = req.body;
  const newReview=await ReviewModel.findByIdAndUpdate(_id, { name, date, text, starRank });
  res.send(newReview);
  console.log("update succeded");
}

module.exports.deleteObject = async (req, res) => {
  const { _id } = req.body;
  const deletedReview=await ReviewModel.findById(_id);
  console.log(deletedReview);
  const movie=await Movie.findById(deletedReview.movieId);
   console.log(movie);
  movie.reviews.pull(deletedReview._id);
  await ReviewModel.findByIdAndDelete(deletedReview._id);
  const changedMovie=await Movie.findByIdAndUpdate(movie._id,movie);
   res.send("Review deleted")
}