const Cart = require("../../models/cartSchema");
const CustomError = require("../../utils/customError");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }

    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
      await cart.save();
      return res.status(200).json(cart);
    }

    cart.products.push({ productId, quantity });
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

module.exports = { addToCart };