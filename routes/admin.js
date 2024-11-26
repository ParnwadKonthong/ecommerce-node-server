const express = require("express");
const router = express.Router();

//controller
const { getOrder, changeOrderStatus } = require("../controllers/admin");
//middleware
const { auth, adminCheck } = require("../middleware/auth");

// @Endpoint http://localhost:5000/api/admin/orders
// @Method  GET/PUT
// @Access  Private
router.get("/admin/orders", auth, getOrder);
router.put("/admin/order-status", auth, changeOrderStatus);

module.exports = router;
