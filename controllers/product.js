const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    const product = await new Product(req.body).save();
    res.send(product);
  } catch (err) {
    res.status(500).send("Create Product Error!!");
  }
};

exports.list = async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    const product = await Product.find()
      .limit(count)
      .populate("category")
      .sort([["createdAt", "desc"]]);
    res.send(product);
  } catch (err) {
    res.status(500).send("List Product Error!!");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    res.send(deleted);
  } catch (err) {
    res.status(500).send("Remove Product Error!!");
  }
};

exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id })
      .populate("category")
      .exec();
    res.send(product);
  } catch (err) {
    res.status(500).send("Read Product Server Error!!");
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    res.send(product);
  } catch (err) {
    res.status(500).send("Update Product Server Error!!");
  }
};

exports.listBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const product = await Product.find()
      .limit(limit)
      .populate("category")
      .sort([[sort, order]]);
    res.send(product);
  } catch (err) {
    res.status(500).send("ListBy Product Error!!");
  }
};

// Filters
const handleQuery = async (req, res, query) => {
  try {
    let products = await Product.find({ $text: { $search: query } }).populate(
      "category", "_id name"
    );
    res.status(200).send(products);
  } catch (err) {
    console.error("Error during query execution:", err);
  }
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({price:{
      $gte:price[0],
      $lte:price[1]
    }}).populate(
      "category", "_id name"
    );
    res.status(200).send(products);
  } catch (err) {
    console.error("Error during price execution:", err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({category}).populate(
      "category", "_id name"
    );
    res.status(200).send(products);
  } catch (err) {
    console.error("Error during category execution:", err);
  }
};

exports.searchFilters = async (req, res) => {
  const { query, price, category } = req.body;
  if (query) {
    console.log("query:", query);
    await handleQuery(req, res, query);
  }
  if (price !== undefined) {
    console.log("price:", price);
    await handlePrice(req, res, price);
  }
  if (category) {
    console.log("category:", category);
    await handleCategory(req, res, category);
  }
};
