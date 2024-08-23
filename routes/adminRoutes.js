const express = require("express");
const router = express();
const tryCatch = require("../utils/tryCatch");
const adminVerification = require("../middlewares/adminVerification");
const admUserController = require("../controllers/Admin/admUserController");
const admProductController = require("../controllers/Admin/admProductController");

//user routes
router.get('/users',adminVerification, tryCatch(admUserController.getAllUsers));//get all users
router.get('/users/:id',adminVerification, tryCatch(admUserController.getUser));//get single user
router.put('/users/:id',adminVerification, tryCatch(admUserController.updateUser));//update user
router.delete('/users/:id',adminVerification, tryCatch(admUserController.deleteUser));//delete user

//product routes
router.get('/product',adminVerification, tryCatch(admProductController.createProduct));//create product
router.get('./products',adminVerification, tryCatch(admProductController.getAllProducts));//get all products
router.put('/product/:productId',adminVerification, tryCatch(admProductController.updateProduct));//update product
router.delete('/product/:productId',adminVerification, tryCatch(admProductController.deleteProduct));//delete product

module.exports = router