// define the routs for the order of the server.

const { Router } = require("express"); 
const{
    getAllOrders,getOrderById,createOrder,updateOrder,deleteOrderById
} =require("../Controllers/OrderController")
const OrderRouter=Router();
OrderRouter.get("/getAllOrders", getAllOrders);
OrderRouter.get("/:id",getOrderById);
OrderRouter.post("/createOrder",createOrder);
OrderRouter.post("/updateOrder", updateOrder);
OrderRouter.delete("/deleteOrderById", deleteOrderById);

//check if we need the routes.
module.exports = OrderRouter;
