const mongoose = require("mongoose");
const product = require("./product");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
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
    orderStatus:{
      type:String,
      default:'Not Process'
    },
    orderdBy:{
      type: ObjectId,
      ref: 'users'
    }
  },
  { timestamps: true }
);

module.exports = Order = mongoose.model("order", orderSchema);
