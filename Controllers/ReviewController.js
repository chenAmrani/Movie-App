const ReviewModel = require("../modules/ReviewModules");

module.exports.getObject = async (req, res) => {
  const Review = await ReviewModel.find();
  res.send(Review);
}

//add Review
module.exports.addObject = async (req, res) => {
  const { _id, name, date, text, starRank } = req.body
  ReviewModel.create({ _id, name, date, text, starRank }).then((data) => {
    console.log("adding a review to the movie");
    console.log(data);
    res.send(data);
  })
}

module.exports.updateObject = async (req, res) => {
  const { _id, name, date, text, starRank } = req.body;
  ReviewModel
    .findByIdAndUpdate(_id, { name, date, text, starRank })
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