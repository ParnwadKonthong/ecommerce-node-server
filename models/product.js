const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      text: true,
    },
    category: {
      type: ObjectId,
      ref: "category",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
    },
    images: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = Product = mongoose.model("product", productSchema);
