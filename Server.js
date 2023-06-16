const express=require('express');  // צד השרת מייבא את אקספרס
const mongoose=require('mongoose'); // מייבאת את מונגו
const cors=require("cors") //cors מייבאת את (קורס) המאפשרת בקשות מתחומים שונים לשרת

require('dotenv').config(); //emv טוען את משתני הסביבה מקובץ (אי אן וי) המכיל נתונים כגון מסד נתונים
const app=express(); // יוצר מופע של אובייקט אקספרס המייצג את השרת האינטרנט

// הגדרות ההתחברות
const routers1 =require('./routes/AppRoutes') ;//מייבא את הראוטר
const routers2 =require('./routes/ReviewRoutes');
const PORT=process.env.port||3100; //מגדיר יציאה עבור השרת ומנסה לקרוא אותה , במקרה שלא מצליח נכנס לערך 3200
app.use(express.json()) // מאפשר לבקשות שמגיעות להיכתב בתצורת גייסון
app.use(cors()) //cors מוסיף את תכונת האמצע של (קורס) כדי לאפשר בקשות חוצות מוצא
//התחברות למסד הנתוניםבאמצעות מחרוזת החיבור שמוינה במשתני הסביבה
mongoose.
connect(process.env.MONGODB_URL) //דרך זה ניגישים לקובץ ומתחברים למונגו db שלנו
.then(()=>console.log(`conect to MONGODB`)).catch((err)=>console.log(err));

//הגדרת הנתבים - מוגדרים לטפל במסלולים שונים ובלוגיקה שקשורה אליהם, הנתבים מיובאים מקובץ הראוטר
app.use(routers1) // האפליקציה שלנו תשתמש בrouters
app.use(routers2)
//מפעיל את השרת ומאזין ביציאה שהוגדרה, ורושם כשהשרת פועל
app.listen(PORT,()=>console.log(`listen to:${PORT}`));//   שלנו באפליקציה התחברות לשרת 
