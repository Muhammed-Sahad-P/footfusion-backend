const Cart = require("../../models/cartSchema");
const CustomError = require("../../utils/customError");

//all carts
const getAllCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json({ carts });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//get single cart
const getCartById = async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.params.id }).populate({
    path: "products.productId",
    select: "name price image",
  });
  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  }
  return res.status(200).json({ cart });
};

module.exports = { getAllCarts, getCartById };
