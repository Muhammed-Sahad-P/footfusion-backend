const Cart = require("../../models/cartSchema");
const CustomError = require("../../utils/customError");

// add to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, userId, price } = req.body;

    if (!productId || !quantity || !userId || !price) {
      return next(
        new CustomError("productId, quantity, and userId are required", 400)
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({
        userId,
        products: [{ productId, quantity, price }],
      });

      await newCart.save();
      return res.status(201).json(newCart);
    }

    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to add product to cart", 500)
    );
  }
};

// get cart
const getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(new CustomError("Cart not found", 404));
    }
    return res.status(200).json(cart);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//update cart
const updateCart = async (req, res, next) => {
  try {
    const { productId, userId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return next(new CustomError("Quantity must be greater than 1", 400));
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(new CustomError("Cart not found", 404));
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return next(new CustomError("Product not found in cart", 404));
    }

    product.quantity = quantity;

    await cart.save();
    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

// delete cart
const removeCart = async (req, res, next) => {
  try {
    const { productId, userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(new CustomError("Cart not found", 404));
    }
    const productExists = cart.products.some(
      (item) => item.productId.toString() === productId
    );

    if (!productExists) {
      return next(new CustomError("Product not found in cart", 404));
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.products.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res
        .status(200)
        .json({ message: "Cart item deleted successfully" });
    }
    await cart.save();
    return res
      .status(200)
      .json({ message: "Product removed successfully", cart });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

module.exports = { addToCart, getCart, updateCart, removeCart };
