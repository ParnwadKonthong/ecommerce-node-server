const mongoose = require("mongoose");
const product = require("./product");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    products:[
      {
        product:{
          type: ObjectId,
          ref: 'product'
        },
        count: Number,
        price: Number
      }
    ],
    cartTotal: Number,
    orderdBy:{
      type: ObjectId,
      ref: 'users'
    }
  },
  { timestamps: true }
);

module.exports = Cart = mongoose.model("cart", cartSchema);
