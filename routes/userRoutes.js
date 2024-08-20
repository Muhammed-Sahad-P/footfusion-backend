const express = require("express");
const router = express();
const tryCatch = require("../utils/tryCatch");
const tokenVerification = require("../middlewares/tokenVerification");
const {getUser} = require("../controllers/User/userController");
const productController= require("../controllers/User/productController");

router.get("/user", tokenVerification, tryCatch(getUser));//get userown data

router.get("/products", tokenVerification, tryCatch(productController.getAllProducts));//get all products
router.get("/product/:productId", tokenVerification, tryCatch(productController.getProductById));//get single product
router.get("/products/:category", tokenVerification, tryCatch(productController.getProductsByCategory));//get products by category

module.exports = router