const Product = require("../../models/productSchema");
const CustomError = require("../../utils/customError");

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

// get single product
const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new CustomError("Product not found", 404));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

// get products by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });

    res.status(200).json(products);
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

module.exports = { getAllProducts, getProductById, getProductsByCategory };
