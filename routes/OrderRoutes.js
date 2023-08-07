// define the routs for the order of the server.

const express = require("express");
const ordersController = require("../Controllers/OrderController");
const router = express.Router();

router.get("/getAllOrders", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/createOrder", ordersController.createOrder);
router.post("/updateOrder", ordersController.updateOrder);
router.delete("/deleteOrderById", ordersController.deleteOrderById);

//check if we need the routes.
module.exports = router;
