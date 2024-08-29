const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const Product = require("../../models/productSchema");
const CustomError = require("../../utils/customError");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

// Setup Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
const createOrder = async (req, res, next) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.id });
    console.log(userCart);
    

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

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      userId: req.user.id,
      products: userCart.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      success: true,
      order: newOrder,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

// Verify Payment
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature === razorpaySignature) {
      const order = await Order.findOne({ razorpayOrderId });

      if (!order) {
        return next(new CustomError("Order not found", 404));
      }

      order.status = "paid";
      order.razorpayPaymentId = razorpayPaymentId;
      await order.save();

      res.status(200).json({ success: true, order });
    } else {
      return next(new CustomError("Payment verification failed", 400));
    }
  } catch (error) {
    return next(
      new CustomError(error.message || "Payment verification failed", 500)
    );
  }
};

// Get All Orders
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

// Get Single Order
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

// Cancel Order
const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new CustomError("Order not found", 404));
    }

    if (order.status === "paid") {
      return next(new CustomError("Cannot cancel a paid order", 400));
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

module.exports = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrderById,
  cancelOrder,
};
