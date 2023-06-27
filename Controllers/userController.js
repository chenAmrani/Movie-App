const userModule = require('../modules/userModules');


module.exports.getUsers=async(req,res)=>{
  userModule.find().then((data)=>{
   console.log("get all users")
   console.log(data)
   res.send(data)
  }); // יביא לנו את כל המשימות כמו גט משרת רק פה אנחנו מבקשים מהמודל
   
}  
module.exports.getUsersById=async(req,res)=>{
   const {_id} = req.body
   userModule.findById(_id).then((data)=>{
      console.log("get Users by ID");
      console.log(data);
      res.send(data);
   })
    
 }  
module.exports.addUser = async (req, res) => {
   const {_id, name, password, email, age } = req.body;
   if (!email || !password || !name || !age) {
     return res.status(400).json({ error: "Missing Name/Password/Email/Age" });
   }


   userModule.create({_id,name,email,password,age}).then((data)=>{ //כל הפעולות האלה נעשות עי ה המודל שלנו עם מטודות בנויות מראש 
      console.log('adding to a list of users ');
      console.log(data);
      res.send(data) //השרת ישלח לנו את המשימה החדשה 
  }).catch((err)=>{
   console.log(err)
   res.status(500).json("error")
  })
}
module.exports.updateUser=async (req,res)=>{
   const {_id,name, password, email, age } = req.body;
   userModule.findByIdAndUpdate(_id,{name,password,email,age}).then((data)=>{
      console.log("update user")
      res.send(data)
   })
}
module.exports.deleteUser=async (req,res)=>{
   const {_id,name, password, email, age } = req.body;
   userModule.findByIdAndDelete(_id).then(()=>res.send("DELETE succsess")).catch((err)=>console.log(err));

}
