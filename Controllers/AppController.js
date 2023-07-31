const userModule = require('../modules/userModules');
const MovieModel=require('../modules/AppModules') // מייבאת את התיקייה של המודל 
module.exports.getObject=async(req,res)=> // כל מטודה אני מייבאת אותה שאוכל להשתמש דרך האובייקט של המודל נשתמש בכל הפונקציות
{
    const Movie=await MovieModel.find(); // יביא לנו את כל המשימות כמו גט משרת רק פה אנחנו מבקשים מהמודל
    res.send(Movie) //כביכול הלקוח יבקש את כל המשימות והשרת ישלח לו אותם
}
module.exports.validateMovie=async(req, res, next)=>
{
    const { userId } = req.body;
  
    // Check if the 'userId' is provided
    if (!userId) {
      res.status(400);
    } else {
      const user = await userModule.findById(userId);
      // Check if the user exists
      if (!user) {
        res.status(400).json("Invalid user id");
      } else {
        // Check if the user is an admin
        if (user.isAdmin !== true) {
          res.status(400).json("Only admin can edit/add/remove games");
        }
      }
    }
    next();
}

module.exports.addObject=async(req,res,next)=> //ליצור אובייקט חדש 
{     
    const{_id,title,year,image,actors,genre}=req.body //הלקוח הקליד בקשה כביכול מזין אובייקט שזה משימה חדש 
   MovieModel.create({_id,title,year,image,actors,genre}).then((data)=>{ //כל הפעולות האלה נעשות עי ה המודל שלנו עם מטודות בנויות מראש 
        console.log('adding to a list of movie ');
        console.log(data);
        res.send(data) //השרת ישלח לנו את המשימה החדשה 
    })
}
module.exports.updateObject=async(req,res,next)=>
{
    const{_id,title,year,image,actors,genre}=req.body; //דיסטרקצר
    MovieModel
    .findByIdAndUpdate(_id,{title,year,image,actors,genre}).then(()=>res.send("update succsess")).catch((err)=>console.log(err));
}
module.exports.deleteObject=async(req,res,next)=>
{
    const{_id}=req.body;
   MovieModel
    .findByIdAndDelete(_id).then(()=>res.send("DELETE succsess")).catch((err)=>console.log(err));
}
// check
