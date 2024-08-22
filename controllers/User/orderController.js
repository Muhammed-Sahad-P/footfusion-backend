const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const CustomError = require("../../utils/customError");

//create order
const createOrder = async (req, res, next) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.id });

    if (!userCart) {
      return next(new CustomError("Cart not found", 404));
    }
    const totalprice = userCart.products.reduce(
      (total, value) => total + value.price * value.quantity,
      0
    );

    const newOrder = new Order({
      userId: req.user.id,
      Products: userCart.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalprice,
    });
    await newOrder.save();
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(201).json(newOrder);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );
    if (!orders) {
      return next(new CustomError("Orders not found", 404));
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
    const order = await Order.findById(orderId).populate("products.productId");
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

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return next(new CustomError("Order not found", 404));
    }
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to cancel order", 500)
    );
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, cancelOrder };
