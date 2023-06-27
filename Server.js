const express=require('express');  
const mongoose=require('mongoose'); 
const cors=require("cors") 
require('dotenv').config();
const app=express(); 
const movieRouter =require('./routes/MovieRoutes') ;
const reviewRouter =require('./routes/ReviewRoutes');
const userRouter=require('./routes/userRoutes')
const PORT=process.env.port||1111; 
app.use(express.json()) 
app.use(cors()) 

mongoose.
connect(process.env.MONGODB_URL) 
.then(()=>console.log(`conect to MONGODB`)).catch((err)=>console.log(err));
app.use(movieRouter) 
app.use(reviewRouter)
app.use(userRouter)
app.listen(PORT,()=>console.log(`listen to:${PORT}`));
