const express = require("express");
const router = express.Router();

//controller
const {
  register,
  login,
  currentUser,
  listUser,
  editUser,
  deleUser,
} = require("../controllers/auth");

//middleware
const { auth, adminCheck } = require("../middleware/auth");

// @Endpoint http://localhost:5000/api/register
// @Method  POST ส่งข้อมูล
// @Access  Publish
router.post("/register", register);

// @Endpoint http://localhost:5000/api/login
// @Method  POST ส่งข้อมูล
// @Access  Publish
router.post("/login", login);

// @Endpoint http://localhost:5000/api//current-user
// @Method  POST ส่งข้อมูล
// @Access  Private
router.post("/current-user", auth, currentUser);

// @Endpoint http://localhost:5000/api//current-admin
// @Method  POST ส่งข้อมูล
// @Access  Private
router.post("/current-admin", auth, adminCheck, currentUser);

// @Endpoint http://localhost:5000/api/auth
// @Method  GET ดึงเรียกดูข้อมูล
// @Access  Publish
router.get("/auth", listUser);

// @Endpoint http://localhost:5000/api/auth
// @Method  PUT แก้ไขแล้วส่งกลับไปที่แทนที่เก่า
// @Access  Publish
router.put("/auth", editUser);

// @Endpoint http://localhost:5000/api/auth
// @Method  DELETE ลบข้อมูล
// @Access  Publish
router.delete("/auth", deleUser);

module.exports = router;
