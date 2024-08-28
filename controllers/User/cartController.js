const Cart = require("../../models/cartSchema");
const CustomError = require("../../utils/customError");

// add to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, userId, quantity = 1 } = req.body;

    if (!productId || !userId) {
      return next(
        new CustomError("productId, quantity, and userId are required", 400)
      );
    }

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
    } else {
      cart.products.push({ productId, quantity });
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
    const cart = await Cart.findOne({ userId }).populate("products.productId");
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
    const { action } = req.body;

    // Find the cart by userId
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return next(new CustomError("Cart not found", 404));
    }

    // Find the product in the cart
    const product = cart.products.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!product) {
      return next(new CustomError("Product not found in cart", 404));
    }

    // Handle increment or decrement action
    if (action === "increment") {
      product.quantity += 1;
    } else if (action === "decrement") {
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        // Remove the product if the quantity is reduced to 0 or less
        cart.products = cart.products.filter(
          (item) => item.productId._id.toString() !== productId
        );
      }
    } else {
      return next(new CustomError("Invalid action for updating quantity", 400));
    }

    // Save the updated cart
    await cart.save();

    // Retrieve the updated cart with populated products
    const updatedCart = await Cart.findOne({ userId }).populate(
      "products.productId"
    );

    return res
      .status(200)
      .json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    return next(new CustomError(error.message || "Something went wrong", 500));
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
    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate(
      "products.productId"
    );

    return res
      .status(200)
      .json({ message: "Product removed successfully", cart: updatedCart });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

module.exports = { addToCart, getCart, updateCart, removeCart };
