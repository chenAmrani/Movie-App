const userModule = require('../Models/userModel');
const userController=require('../Controllers/userController')
const MovieModel=require('../Models/movieModel') // מייבאת את התיקייה של המודל 
module.exports.getObject=async(req,res)=> // כל מטודה אני מייבאת אותה שאוכל להשתמש דרך האובייקט של המודל נשתמש בכל הפונקציות
{
    const Movie=await MovieModel.find(); // יביא לנו את כל המשימות כמו גט משרת רק פה אנחנו מבקשים מהמודל
    res.send(Movie) //כביכול הלקוח יבקש את כל המשימות והשרת ישלח לו אותם
}
module.exports.getObjectById = async (req, res) => {
  try {
      const { id } = req.query; // Use req.params instead of req.query
      if (id==undefined){
        const {id} =req.query;
      }
      console.log(id);
      const movie = await MovieModel.findById(id).populate("reviews");
      if (movie) {
          res.status(200).json(movie); // Send the movie as a JSON response
      } else {
          res.status(404).json({ message: "Movie not found" }); // Movie not found
      }
  } catch (err) {
      res.status(500).json({ message: "Internal server error" }); // Handle errors
  }
};
module.exports.validateMovie=async(req, res, next)=>
{
    const { userId } = req.body;
  
    if (await userModule.findById(userId)==null) {
      console.log("userId doesant find")
      res.status(400);
      return;
    }
     else{
          const user = await userController.getUserByID(userId);
        if (user.isAdmin !== true) {
          console.log("user is not admin");
          res.status(400).json("Only admin can edit/add/remove movies");
          return;
        }
    }
    next(); 
}
module.exports.addObject=async(req,res,next)=> //ליצור אובייקט חדש 
{   
  console.log("Arrived"); 
    const{_id,title, year, rating, actors,actor_facets,price, genre, trailer,image, description}=req.body //הלקוח הקליד בקשה כביכול מזין אובייקט שזה משימה חדש 
   MovieModel.create({_id,title, year, rating, actors,actor_facets,price, genre, trailer,image, description}).then((data)=>{ //כל הפעולות האלה נעשות עי ה המודל שלנו עם מטודות בנויות מראש 
        console.log('adding to a list of movie ');
        console.log(data);
        res.send(data) //השרת ישלח לנו את המשימה החדשה 
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
