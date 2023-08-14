const Order = require("../modules/OrderModules");
const userController = require("./userController");
const userModel= require("../modules/userModules");



const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("movies");
        res.status(200).send(orders);
    } catch (err) {
        res.status(400).send("Something went wrong -> getAllOrders");
      }
    };

// ---------------------------------------------------------------------------------------

    const getOrderById = async (req, res) => {
        try {
          const { id } = req.query;
          const order = await Order.findById(id).populate("movies").exec();
          if (order) return order;
          res.status(200).send(order);
        } catch (err) {
            res.status(400).send("Something went wrong -> getOrderById");
          }
      };

// ---------------------------------------------------------------------------------------

const createOrder = async (req, res) => {
  try {
    const { order } = req.body;
    const newOrder = new Order({
      user: order.user,
      movies: order.movies,
      orderNumber: order.orderNumber,
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Update user's orders
    const user = await userController.getUserByID(order.user);
    for (let i=0;i<newOrder.movies.length;i++){
      const tempMovie=newOrder.movies[i];
      if (!user.movies.includes(tempMovie)){
        user.movies.push(tempMovie);
        await userModel.findByIdAndUpdate(user._id,user).then((data)=>console.log(data));
      }
    }
    user.orders.push(savedOrder._id);
    await userModel.findByIdAndUpdate(user._id,user).then((data)=>console.log(data));
     // Update user's movies
    res.status(201).send(savedOrder);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// ---------------------------------------------------------------------------------------

const updateOrder = async (req, res) => {
    try {
      const { _id, order } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate({ _id: _id } , order);
      res.status(200).send(updatedOrder);
    } catch (err) {
        res.status(400).send(err.message);
      }
  };

  // ---------------------------------------------------------------------------------------

  const deleteOrderById = async (req,res) => {
    try {
      const { _id } = req.body;
      const deletedOrder = await Order.findByIdAndDelete(_id);
      const user = await userController.getUserByID(deletedOrder.user);
      user.orders.pull(deletedOrder._id); 
      await userModel.findByIdAndDelete(user._id);
      res.status(200).send(deletedOrder);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  // ---------------------------------------------------------------------------------------

  module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrderById,
  };
  