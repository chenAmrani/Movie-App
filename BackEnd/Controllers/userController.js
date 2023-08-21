const userModule = require('../modules/userModules');
const createError=require('http-errors');
const {authSchema}=require('../modules/validationModule');

const{signAccessToken,signRefreshToken,verifyRefreshToken}=require('../utils/jwt_helper');
const { default: isEmail } = require('validator/lib/isEmail');

module.exports.getUsers=async(req,res)=>{
  userModule.find().then((data)=>{
   console.log("get all users")
   console.log(data)
   res.send(data)
  }); // יביא לנו את כל המשימות כמו גט משרת רק פה אנחנו מבקשים מהמודל
   
}  
module.exports.getUserByEmail = async (req, res) => {
   try {
      const { email } = req.query; // Change req.body to req.query
      const user = await userModule.findOne({ email: email }).populate({
         path:'orders',
         populate:{
            path:'movies',
            model:'Movie'
         }
      }).populate("movies").exec();
      res.send(user);
   } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching the user by email.");
   }
};

module.exports.getUsersById=async(req,res)=>{
   const {_id} = req.query
   userModule.findById(_id).then((data)=>{
      console.log("get Users by ID");
      res.send(data);
   })
 }  
 
 module.exports.getUserByID=async(id)=>{
   return await userModule.findById(id);
 }
 

 module.exports.addUser = async (req, res, next) => {
   try {
      const { email, password, name, age } = req.body;

      // Validate input data using the authSchema
      await authSchema.validateAsync({ name, email, password, age });

      const doesExist = await userModule.findOne({ email: email });
      if (doesExist) {
         const errorMessage = `${email} is already registered`;
         res.status(409).json({ error: errorMessage });
         return;
      }

      const accessToken = await signAccessToken(email);
      const refreshToken = await signRefreshToken(email);

      const result = {
         email, password, name, age, refreshToken
      };

      const user = new userModule(result);
      const savedUser = await user.save();
      
      res.send({ accessToken, refreshToken });

   } catch (error) {
      if (error.isJoi === true) {
         const errorMessage = error.details[0].message; // Extract the error message from the validation error
         res.status(400).json({ error: errorMessage }); // Return the error message as JSON
      }
      next(error);
   }
}

module.exports.loginUser = async (req, res, next) => {
   try {
       const result = await authSchema.validateAsync(req.body);
       const user = await userModule.findOne({ email: result.email });
       if (!user) {
           throw createError.NotFound('User not registered');
       }
       const isMatch = await user.isValidPassword(result.password);
       if (!isMatch) {
           throw createError.Unauthorized('Email/Password is not valid');
       }
       const accessToken = await signAccessToken(user.id);
       const refreshToken = await signRefreshToken(user.id);
       user.refreshToken = refreshToken;
       await userModule.findByIdAndUpdate(user._id, user);
       res.json({ accessToken, refreshToken }); // Sending JSON response

   } catch (error) {
       if (error.isJoi === true) {
           return next(createError.BadRequest('Invalid username/password'));
       }
       next(error);
   }
};
module.exports.logOutUser=async(req,res)=>{
   const {email}=req.body;
   const user= await userModule.findOne({email:email});
   user.refreshToken='';
   await userModule.findByIdAndUpdate(user._id,user);
   console.log(user);
   
   
}
module.exports.refreshT=async(req,res,next)=>{
   try{

     const { refreshtoken }=req.body;
      if(!refreshtoken) {throw createError.BadRequest()};
      const userId= await verifyRefreshToken(refreshtoken);
      const accessToken=await signAccessToken(userId);
      const refToken=await signRefreshToken(userId);
      res.send({accessToken: accessToken, refreshToken: refToken})

   }catch(err){next(err)}
}
module.exports.tokenUser=async(req,res)=>{
   const refreshToken=localStorage()
   res.cookie()
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

