const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    address: Object,
    favorites:[{
        type: ObjectId,
        ref: 'product'
    }]
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", userSchema);
