const mongoose = require('mongoose');
const validator = require('validator');

const userSchema=mongoose.userSchema({
    name: {
        type:String,
        required: true,
        
    }
})