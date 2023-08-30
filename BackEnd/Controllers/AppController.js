const userModule = require('../Models/userModel');
const userController=require('../Controllers/userController')
const MovieModel=require('../Models/movieModel') 
module.exports.getObject=async(req,res)=> 
{
    const Movie=await MovieModel.find(); 
    res.send(Movie) 
}
module.exports.getObjectById = async (req, res) => {
  try {
      const { id } = req.query; 
      if (id==undefined){
        const {id} =req.query;
      }
      const movie = await MovieModel.findById(id).populate("reviews");
      if (movie) {
          res.status(200).json(movie); 
      } else {
          res.status(404).json({ message: "Movie not found" }); 
      }
  } catch (err) {
      res.status(500).json({ message: "Internal server error" }); 
  }
};
module.exports.validateMovie=async(req, res, next)=>
{
    const { userId } = req.body;
  
    if (await userModule.findById(userId)==null) {
      res.status(400).send("Unable to find ID");
      return;
    }
     else{
          const user = await userController.getUserByID(userId);
        if (user.isAdmin !== true) {
          res.status(401).json("Only admin can edit/add/remove movies");
          return;
        }
    }
    next(); 
}
module.exports.addObject=async(req,res,next)=> 
{   
  console.log("Arrived"); 
    const{_id,title, year, rating, actors,actor_facets,price, genre, trailer,image, description}=req.body 
   MovieModel.create({_id,title, year, rating, actors,actor_facets,price, genre, trailer,image, description}).then((data)=>{ 
        res.send(data) 
    })
}
module.exports.updateObject=async(req,res,next)=>
{
    const{movieId,title, year, rating, actors,actor_facets,price, genre, trailer,image, description}=req.body; 
    const isUpdated=await MovieModel
    .findByIdAndUpdate(movieId,{title, year, rating, actors,actor_facets,price, genre, trailer,image, description});
    if (isUpdated) res.send("Movie has been updated");
    else ("There was an issue updating the movie");
}
module.exports.deleteObject=async(req,res,next)=>
{
    const{movieId}=req.body;
   const isDeleted= await MovieModel
    .findByIdAndDelete({_id:movieId});
    if(isDeleted) res.send("Movie has been deleted");
    else res.send("There was an issue deleting the movie");
}
