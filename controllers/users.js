const bcrypt = require("bcryptjs");

// User
const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

const jwt = require("jsonwebtoken");
const { token } = require("morgan");

//GET ดึงเรียกดูข้อมูล listUsers
exports.listUsers = async (req, res) => {
  try {
    const user = await User.find({}).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//GET ดึงเรียกดูข้อมูล readUsers
exports.readUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//PUT แก้ไขแล้วส่งกลับไปที่แทนที่เก่า updateUsers
exports.updateUsers = async (req, res) => {
  try {
    var { id, password } = req.body.values;
    // gen salt
    const salt = await bcrypt.genSalt(10);
    // encrypt
    var enPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: enPassword }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//DELETE ลบข้อมูล updateUsers
exports.removeUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//POST ส่งข้อมูล changeStatus
exports.changeStatus = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { enabled: req.body.enabled }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//POST ส่งข้อมูล changeRole
exports.changeRole = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { role: req.body.role }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//POST ส่งข้อมูล userCart
exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    // Check User
    let user = await User.findOne({ username: req.user.username }).exec();
    // create arry []
    let products = [];
    // Check and Delete cart old
    let cartOld = await Cart.findOne({ orderdBy: user._id }).exec();
    if (cartOld) {
      await cartOld.deleteOne();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.price = cart[i].price;

      products.push(object);
    }
    // Totle prict in cart
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = await new Cart({
      products,
      cartTotal,
      orderdBy: user._id,
    }).save();

    console.log(newCart);
    res.send("userCart Ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("useCart Server Error");
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    let cart = await Cart.findOne({ orderdBy: user._id })
      .populate("products.product", "_id title price")
      .exec();
    const { products, cartTotal } = cart;
    res.json({ products, cartTotal });
  } catch (err) {
    res.status(500).send("getUserCart Error");
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    const empty = await Cart.findOneAndDelete({ orderdBy: user._id }).exec();

    res.send(empty);
  } catch (err) {
    res.status(500).send("Remove Cart Error");
  }
};

exports.saveAddress = async (req, res) => {
  console.log("arrived");
  try {
    const userAddress = await User.findOneAndUpdate(
      { username: req.user.username },
      { address: { ...req.body } }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Save Address Error");
  }
};

exports.getUserAddress = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    if (!user.address) {
      return res.status(404).json({ message: "ที่อยู่ไม่พบ" });
    }
    res.json({ address: user.address });
  } catch (err) {
    res.status(500).send("getUserAddress Error");
  }
};

exports.saveOrder = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.user.username }).exec();

    let userCart = await Cart.findOne({ orderdBy: user._id }).exec();

    let order = await new Order({
      products: userCart.products,
      orderdBy: user._id,
      cartTotal: userCart.cartTotal,
    }).save();

    // +-products
    let bulkOption = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});

    res.send(updated);
  } catch (err) {
    res.status(500).send("Save Order Error");
  }
};

exports.getOrder = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    const orders = await Order.find({ orderdBy: user._id })
      .populate("products.product")
      .exec();
    res.json(orders);
  } catch (err) {
    res.status(500).send("getOrders Error");
  }
};

exports.addFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    let user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $addToSet: { favorites: productId } }
    ).exec();
    res.send(user);
  } catch (err) {
    res.status(500).send("Add Favorites Error");
  }
};

exports.getFavorites = async (req, res) => {
  try {
    let list = await User.findOne({ username: req.user.username })
      .select("favorites")
      .populate("favorites")
      .exec();
    res.json(list);
  } catch (err) {
    res.status(500).send("Get Favorites Error");
  }
};

exports.removeFavorites = async (req, res) => {
  try {
    // http://localhost/user/favorites/12323423453
    const { productId } = req.params;
    let user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $pull: { favorites: productId } }
    ).exec();
    res.send(user);
  } catch (err) {
    res.status(500).send("Remove Favorites Error");
  }
};
