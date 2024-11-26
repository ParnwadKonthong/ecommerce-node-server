const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const token = req.headers["authtoken"];

    if (!token) {
      return res.status(401).send("No token, authorizaation denied");
    }
    const decoded = jwt.verify(token, "jwtSecret");

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Token Invavid!!!");
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const User = require("../models/user");
    const { username } = req.user;
    const adminUser = await User.findOne({ username }).exec();
    if (adminUser.role !== "admin") {
      res.status(403).send(err, "Admin Access denied");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Access denied");
  }
};
