const Order = require("../../models/orderSchema");
const CustomError = require("../../utils/customError");

//create order
const createOrder = async (req, res, next) => {
  try {
    const neworder = await Order.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(neworder);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id });

    if (!orders || orders.length === 0) {
      return next(new CustomError("No orders found", 404));
    }
    res.status(200).json(orders);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//get single order
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new CustomError("Order not found", 404));
    }
    res.status(200).json(order);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new CustomError("Order not found", 404));
    }

    await Order.deleteOne({ _id: orderId });

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to cancel order", 500)
    );
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, cancelOrder };
