const { Router } = require("express"); 
const userRouter=Router();
const{addUser ,getUsers,getUsersById,updateUser,deleteUser}=require('../Controllers/userController')

userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUsersById);
userRouter.post('/register',addUser);
userRouter.post('/updateUser',updateUser);
userRouter.post('/deleteUser',deleteUser)


module.exports=userRouter;

