const Wishlist = require("../../models/wishlistSchema");
const CustomError = require("../../utils/customError");

//add to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return next(new CustomError("userId and productId are required", 400));
    }

    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (wishlist) {
      // Check if the product already exists in the wishlist
      const productExists = wishlist.products.some(
        (item) => item._id.toString() === productId
      );

      if (productExists) {
        // Remove the product from the wishlist
        wishlist.products = wishlist.products.filter(
          (item) => item._id.toString() !== productId
        );
        await wishlist.save();
        return res
          .status(200)
          .json({
            message: "Product removed from wishlist",
            wishlist: await wishlist.populate("products"),
          });
      } else {
        // Add the product to the wishlist
        wishlist.products.push(productId);
        await wishlist.save();
        return res
          .status(200)
          .json({
            message: "Product added to wishlist",
            wishlist: await wishlist.populate("products"),
          });
      }
    } else {
      // Create a new wishlist if it doesn't exist and add the product
      wishlist = new Wishlist({ userId, products: [productId] });
      const result = await wishlist.save();
      return res
        .status(201)
        .json({
          message: "Product added to wishlist",
          wishlist: await result.populate("products"),
        });
    }
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to update wishlist", 500)
    );
  }
};

//get wishlist
const getWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId }).populate("products"); // Populating the product details

    if (!wishlist) {
      return next(new CustomError("Wishlist not found", 404));
    }

    if (wishlist.products.length === 0) {
      return next(new CustomError("Wishlist is empty", 404));
    }

    res.status(200).json(wishlist);
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to get wishlist", 500)
    );
  }
};
//delete wishlist
const deleteWishlist = async (req, res, next) => {
  try {
    const { productId, userId } = req.params;

    if (!productId) {
      return next(new CustomError("productId is required", 400));
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return next(new CustomError("Wishlist not found", 404));
    }

    await wishlist.updateOne({ $pull: { products: productId } });

    const updatedWishlist = await Wishlist.findOne({ userId });
    if (
      updatedWishlist.products.some((item) => item.toString() === productId)
    ) {
      return next(new CustomError("Product not found in wishlist", 404));
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return next(
      new CustomError(
        error.message || "Failed to delete product from wishlist",
        500
      )
    );
  }
};

module.exports = { addToWishlist, getWishlist, deleteWishlist };
