const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Category = mongoose.model("category", categorySchema);
