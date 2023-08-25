const mongoose=require('mongoose')
const validator=require('validator');
const bcryptjs=require('bcryptjs');
const { error } = require('@hapi/joi/lib/base');
const userModule=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,'Please provide an email']
    },
    age:{
        type:Number,
        required:true
    },
    genre:{
        type:String
    },
    isAdmin: {
        type: Boolean,
        default:false,
    },
    refreshToken:{
      type:String
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
        }
    ],
    movies :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Movie"
        }
    ],
   
 
});
userModule.pre('save',async function (next){ // make the password a hash password .
    try{
      
       const salt=await bcryptjs.genSalt(10)
       const hashPassword= await bcryptjs.hash(this.password,salt);
       this.password=hashPassword;
       next()
    }catch(error){next(error)}


})
userModule.methods.isValidPassword=async function(password)
{
    try{
       return await bcryptjs.compare(password,this.password)

    }catch(error) {throw error}
}

module.exports = mongoose.model('user',userModule);