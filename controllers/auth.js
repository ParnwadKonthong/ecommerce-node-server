const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

//POST ส่งข้อมูล register
exports.register = async (req, res) => {
  try {
    // Check user and email
    const { username, email, password } = req.body;
    var user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("ชื่อผู้ใช้นี้มีอยู่แล้ว !");
    }
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("อีเมลนี้มีอยู่แล้ว !" );
    }

    // ตรวจสอบความถูกต้องของรูปแบบอีเมล
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("รูปแบบอีเมลไม่ถูกต้อง ! ");
    }

    // ตรวจสอบความยาวของรหัสผ่านต้องมากกว่า 6 ตัว
    if (password.length < 6) {
      return res.status(400).send("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร !");
    }

    const salt = await bcrypt.genSalt(10);
    user = new User({
      username,
      email,
      password,
    });

    //  Encrypt
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.send("สมัครสมาชิกสำเร็จ");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//POST ส่งข้อมูล login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    var user = await User.findOneAndUpdate({ email }, { new: true });
    if (user && user.enabled) {
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("รหัสผ่านไม่ถูกต้อง !");
      }
      // Payload
      const payload = {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
      // Generate Token
      jwt.sign(payload, "jwtSecret", { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      return res.status(400).send("ไม่พบผู้ใช้ !");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//POST ส่งข้อมูล currentUser
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({username: req.user.username})
    .select('-password').exec();
    res.send(user)

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//GET ดึงเรียกดูข้อมูล
exports.listUser = async (req, res) => {
  try {
    res.send("List Get User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//PUT แก้ไขแล้วส่งกลับไปที่แทนที่เก่า
exports.editUser = async (req, res) => {
  try {
    res.send("Edit User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

//DELETE ลบข้อมูล
exports.deleUser = async (req, res) => {
  try {
    res.send("Delete User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};
