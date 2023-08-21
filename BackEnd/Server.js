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
const statisticsRouter=require('./routes/StatisticsRoutes');
const userRouter=require('./routes/userRoutes');
const orderRouter=require('./routes/OrderRoutes');


const PORT=process.env.port||1113; 
app.use(express.json()) 
app.use(cors()) 
mongoose.
connect(process.env.MONGODB_URL) 
.then(()=>console.log(`conect to MONGODB`)).catch((err)=>console.log(err));
app.use(movieRouter) 
app.use(reviewRouter)
app.use(statisticsRouter)
app.use(orderRouter)
app.use(userRouter)



app.listen(PORT,()=>console.log(`listen to:${PORT}`));
