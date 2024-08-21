const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
