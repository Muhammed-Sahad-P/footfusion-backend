const express = require("express");
const router = express();
const tryCatch = require("../utils/tryCatch");
const tokenVerification = require("../middlewares/tokenVerification");
const {getUser} = require("../controllers/User/userController");
const productController= require("../controllers/User/productController");
const cartController = require("../controllers/User/cartController");
const wishlistController = require("../controllers/User/wishlistController");

//user routes
router.get("/user", tokenVerification, tryCatch(getUser));//get userown data

//product routes
router.get("/products", tokenVerification, tryCatch(productController.getAllProducts));//get all products
router.get("/product/:productId", tokenVerification, tryCatch(productController.getProductById));//get single product
router.get("/products/:category", tokenVerification, tryCatch(productController.getProductsByCategory));//get products by category

//cart routes
router.post("/cart", tokenVerification, tryCatch(cartController.addToCart));//add to cart
router.get("/cart/:userId", tokenVerification, tryCatch(cartController.getCart));//get cart
router.put("/cart/:userId/:productId", tokenVerification, tryCatch(cartController.updateCart));//update cart
router.delete("/cart/:userId/:productId", tokenVerification, tryCatch(cartController.removeCart));//delete cart

//wishlist routes
router.post("/wishlist", tokenVerification, tryCatch(wishlistController.addToWishlist));//add to wishlist
router.get("/wishlist/:userId", tokenVerification, tryCatch(wishlistController.getWishlist));//get wishlist
router.delete('/wishlist/:userId/:productId', tokenVerification, tryCatch(wishlistController.deleteWishlist));//delete wishlist

module.exports = router
