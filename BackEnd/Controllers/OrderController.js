const Order = require("../modules/OrderModules");
const userController = require("./userController");



const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("games");
        res.status(200).send(orders);
    } catch (err) {
        res.status(400).send("Something went wrong -> getAllOrders");
      }
    };

// ---------------------------------------------------------------------------------------

    const getOrderById = async (req, res) => {
        try {
          const { id } = req.body;
          const order = await Order.findById(id).populate("movies");
          res.status(200).send(order);
        } catch (err) {
            res.status(400).send("Something went wrong -> getOrderById");
          }
      };

// ---------------------------------------------------------------------------------------

      const createOrder = async (req ,res) => {
        try {
            const { order } = req.body;
            const newOrder = new Order({
            user: order.user,
            movies: order.movies,
            orderNumber: order.orderNumber,
          });
        
          const user = await userController.getUserById(order.user);
          user.orders.push(newOrder._id);
          res.status(200).send(newOrder);
        } catch (err) {
            res.status(400).send("Something went wrong -> createOrder");
          }
      };

// ---------------------------------------------------------------------------------------

const updateOrder = async (req, res) => {
    try {
      const { id, order } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate({ _id: id } , order);
      res.status(200).send(updatedOrder);
    } catch (err) {
        res.status(400).send("Something went wrong -> updateOrder");
      }
  };

  // ---------------------------------------------------------------------------------------

  const deleteOrderById = async (req,res) => {
    try {
      const { id } = req.body;
      const deletedOrder = await Order.findByIdAndDelete(id);
      const user = await userController.getUserById(deletedOrder.user);
      user.orders.pull(deletedOrder._id); 
      await userController.updateUser(user._id, user);
      res.status(200).send(deletedOrder);
    } catch (err) {
      res.status(400).send("Something went wrong -> deleteOrder");
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
  