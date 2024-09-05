const User = require("../../models/userSchema");
const CustomError = require("../../utils/customError");
const Order = require("../../models/orderSchema");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        select: "name price image", 
      })
      .populate("userId");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getAllOrdersOfUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .populate({
        path: "products.productId",
        select: "name price image", 
      })
      .populate("userId");

    if (!orders || orders.length === 0) {
      return next(new CustomError("Orders not found", 404));
    }
    res.status(200).json({ orders });
  } catch (error) {
    next(new CustomError("Failed to fetch orders", 500));
  }
};

//update order
const updateOrder = async (req, res, next) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .populate("products.productId")
    .populate("userId");
  if (!updatedOrder) return next(new CustomError("Order not found", 404));
  res.status(200).json(updatedOrder);
};

//cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.orderId);
    if (!deleted) return next(new CustomError("Order not found", 404));
    res.status(200).json("Order has been deleted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllOrders, getAllOrdersOfUser, updateOrder, cancelOrder };
