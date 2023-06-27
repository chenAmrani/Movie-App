const mongoose=require('mongoose')
const validator=require('validator');
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
        unique:true,
        validate:[validator.isEmail,'Please provide an email']
    },
    age:{
        type:Number,
        required:true
    },
    genre:{
        type:String
    }
 
});

module.exports = mongoose.model('user',userModule);