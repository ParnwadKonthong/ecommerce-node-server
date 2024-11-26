const express = require("express");
const router = express.Router();

//controller
const {
  listUsers,
  readUsers,
  updateUsers,
  removeUsers,
  changeStatus,
  changeRole,
  userCart,
  getUserCart,
  saveAddress,
  getUserAddress,
  saveOrder,
  emptyCart,
  addFavorites,
  getFavorites,
  removeFavorites,
  getOrder,
} = require("../controllers/users");
//middleware
const { auth, adminCheck } = require("../middleware/auth");

// @Endpoint http://localhost:5000/api/users
// @Method  GET ดึงเรียกดูข้อมูล
// @Access  Private
router.get("/users", auth, adminCheck, listUsers);

// @Endpoint http://localhost:5000/api/users/:id
// @Method  GET ดึงเรียกดูข้อมูล
// @Access  Private
router.get("/users/:id", readUsers);

// @Endpoint http://localhost:5000/api/users/:id
// @Method  PUT แก้ไขแล้วส่งกลับไปที่แทนที่เก่า
// @Access  Private
router.put("/users/:id", updateUsers);

// @Endpoint http://localhost:5000/api/users/:id
// @Method  DELETE ลบข้อมูล
// @Access  Private
router.delete("/users/:id", removeUsers);

// @Endpoint http://localhost:5000/api/changestatus
// @Method  POST
// @Access  Private
router.post("/changestatus", auth, adminCheck, changeStatus);

// @Endpoint http://localhost:5000/api/changerole
// @Method  POST
// @Access  Private
router.post("/changerole", auth, adminCheck, changeRole);

// @Endpoint http://localhost:5000/api/user/cart
// @Method  POST/GET/DELETE
// @Access  Private
router.post("/user/cart", auth, userCart);
router.get("/user/cart", auth, getUserCart);
router.delete("/user/cart", auth, emptyCart);

// @Endpoint http://localhost:5000/api/user/adress
// @Method  POST/GET
// @Access  Private
router.post("/user/address", auth, saveAddress);
router.get("/user/address", auth, getUserAddress);

// @Endpoint http://localhost:5000/api/user/order
// @Method  POST/GET
// @Access  Private
router.post("/user/order", auth, saveOrder);
router.get("/user/orders", auth, getOrder);

// @Endpoint http://localhost:5000/api/user/favorites
// @Method  POST/GET/PUT
// @Access  Private
router.post("/user/favorites", auth, addFavorites);
router.get("/user/favorites", auth, getFavorites);
router.put("/user/favorites/:productId", auth, removeFavorites);


module.exports = router;

// 668b824454b9622877b45bea
