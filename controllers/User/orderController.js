const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const Product = require("../../models/productSchema");
const CustomError = require("../../utils/customError");

//create order
const createOrder = async (req, res, next) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.id });

    if (!userCart) {
      return next(new CustomError("Cart not found", 404));
    }

    const totalPrice = await userCart.products.reduce(
      async (totalPromise, item) => {
        const total = await totalPromise;
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new CustomError(
            `Product not found with ID: ${item.productId}`,
            404
          );
        }
        return total + product.price * item.quantity;
      },
      Promise.resolve(0)
    );

    const newOrder = new Order({
      userId: req.user.id,
      products: userCart.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice,
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
    if (!orders || orders.length === 0) {
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

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new CustomError("Order not found", 404));
    }

    order.status = "cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to cancel order", 500)
    );
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, cancelOrder };
