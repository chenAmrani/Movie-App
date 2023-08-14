const express=require('express');  
const morgan=require('morgan')
const createError=require('http-errors');
const mongoose=require('mongoose'); 
const cors=require("cors") 
const{verifyAccessToken}=require('./utils/jwt_helper');
require('dotenv').config();
const app=express(); 
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}))
const movieRouter =require('./routes/AppRoutes') ;
const reviewRouter =require('./routes/ReviewRoutes');
const userRouter=require('./routes/userRoutes')
const orderRouter=require('./routes/OrderRoutes')
const PORT=process.env.port||1113; 
app.use(express.json()) 
app.use(cors()) 
app.get('/',verifyAccessToken,async (req,res,next)=>{
   res.send('hello from my app');
})
mongoose.
connect(process.env.MONGODB_URL) 
.then(()=>console.log(`conect to MONGODB`)).catch((err)=>console.log(err));
app.use(movieRouter) 
app.use(reviewRouter)
app.use(userRouter)
app.use(orderRouter)
app.listen(PORT,()=>console.log(`listen to:${PORT}`));
