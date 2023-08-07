const ReviewModel = require("../modules/ReviewModules");
const User=require("../modules/userModules")
const Movie=require("../modules/AppModules")
const MovieController=require("../Controllers/AppController")

module.exports.getObject = async (req, res) => {
  const Review = await ReviewModel.find();
  res.send(Review);
}

//add Review
module.exports.addObject = async (req, res) => {
  const { _id, name, date, text, starRank } = req.body
  // const { id: userId } = User;
  const Review=ReviewModel.create({ _id, name, date, text, starRank }).then((data) => {
    console.log("adding a review to the movie");
    console.log(data);
    res.send(data);
  })
  // const{movieId}=Review.movie;
  // const movie=await MovieController.getObjectById(movieId);
  // movie.Review.push(Review._id);

}

module.exports.updateObject = async (req, res) => {
  const { _id, name, date, text, starRank } = req.body;
  // const { id: userId } = User;
  // const{id:movieId}=Movie
  
  ReviewModel
    .findByIdAndUpdate(_id, { name, date, text, starRank ,userId })
    .then(() => res.send("update succeeded"))
    .catch((err) => console.log(err));
}

module.exports.deleteObject = async (req, res) => {
  const { _id } = req.body;
  ReviewModel
    .findByIdAndDelete(_id)
    .then(() => res.send("DELETE succsess"))
    .catch((err) => console.log(err));
}