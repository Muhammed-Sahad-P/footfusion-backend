const Product = require("../../models/productSchema");
const CustomError = require("../../utils/customError");
const { createProductSchema } = require("../../models/joiSchema");

//create product
const createProduct = async (req, res, next) => {
  try {
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, description, price, category, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//update product
const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        category,
        image,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

//delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return next(new CustomError(error, 500));
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
