const express = require("express");
const router = express();
const tryCatch = require("../utils/tryCatch");
const {adminVerification} = require("../middlewares/tokenVerification");
const admUserController = require("../controllers/Admin/admUserController");
const admProductController = require("../controllers/Admin/admProductController");
const admCartController = require("../controllers/Admin/admCartController");
const admOrderController = require("../controllers/Admin/admOrderController");
const admRevenueController = require("../controllers/Admin/admRevenueController");

//user routes
router.get('/users',adminVerification, tryCatch(admUserController.getAllUsers));//get all users
router.get('/users/:id',adminVerification, tryCatch(admUserController.getUser));//get single user
router.put('/users/:id',adminVerification, tryCatch(admUserController.updateUser));//update user
router.delete('/users/:id',adminVerification, tryCatch(admUserController.deleteUser));//delete user

//product routes
router.post('/product',adminVerification, tryCatch(admProductController.createProduct));//create product
router.get('/products',adminVerification, tryCatch(admProductController.getAllProducts));//get all products
router.put('/product/:productId',adminVerification, tryCatch(admProductController.updateProduct));//update product
router.delete('/product/:productId',adminVerification, tryCatch(admProductController.deleteProduct));//delete product

//cart routes
router.get('/carts',adminVerification, tryCatch(admCartController.getAllCarts));//get all carts
router.get('/carts/:id',adminVerification, tryCatch(admCartController.getCartById));//get single cart



//order routes
router.get('/orders',adminVerification, tryCatch(admOrderController.getAllOrders));//get all orders of users
router.get('/orders/:id',adminVerification, tryCatch(admOrderController.getAllOrdersOfUser));//get all orders of single user
router.put('/orders/:orderId',adminVerification, tryCatch(admOrderController.updateOrder));//update one order
router.delete('/orders/:orderId',adminVerification, tryCatch(admOrderController.cancelOrder));//delete one order

//revenue routes
router.get('/revenue',adminVerification, tryCatch(admRevenueController.totalRevenue));//total revenue
router.get('/purchase',adminVerification, tryCatch(admRevenueController.productsPurchased));//total purchase
module.exports = router