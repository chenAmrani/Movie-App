const { Router } = require("express"); 
const userRouter=Router();
const{addUser ,getUsers,getUsersById,updateUser,deleteUser,loginUser,refreshT,getUserByEmail}=require('../Controllers/userController')



// User actions
userRouter.post('/register',addUser);
userRouter.post('/login',loginUser);
userRouter.post('/refresh-token',refreshT)



// CRUD
userRouter.get("/users", getUsers);
userRouter.get("/email", getUserByEmail);
userRouter.get("/:id", getUsersById);
userRouter.post('/updateUser',updateUser);
userRouter.post('/deleteUser',deleteUser);


module.exports=userRouter;

