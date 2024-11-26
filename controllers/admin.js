const Order = require("../models/order");

exports.getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("orderdBy", "username")
      .exec();
    res.json(orders)
  } catch (err) {
    res.status(500).send("get Orders Error");
  }
}

exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    let orderUpdate = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { nre: true }
    );
    res.send(orderUpdate);
  } catch (err) {
    res.status(500).send("Update Order Status Error!!");
  }
};
