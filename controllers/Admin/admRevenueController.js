const Order = require("../../models/orderSchema");
const CustomError = require("../../utils/customError");

const totalRevenue = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Return 0 if no data is found
    if (stats.length === 0) {
      return res.status(200).json({ revenue: 0 });
    }

    res.status(200).json({ revenue: stats[0].revenue });
  } catch (error) {
    return next(
      new CustomError(error.message || "Failed to calculate total revenue", 500)
    );
  }
};

const productsPurchased = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$products" }, // Deconstruct the products array
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
    ]);

    // Return 0 if no data is found
    if (stats.length === 0) {
      return res.status(200).json({ totalQuantity: 0 });
    }

    res.status(200).json({ totalQuantity: stats[0].totalQuantity });
  } catch (error) {
    return next(
      new CustomError(
        error.message || "Failed to calculate total products purchased",
        500
      )
    );
  }
};

module.exports = { totalRevenue, productsPurchased };
