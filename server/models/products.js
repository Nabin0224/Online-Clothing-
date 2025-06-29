const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: [],
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    colors: [
      {
        colorName: String,
        code: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
