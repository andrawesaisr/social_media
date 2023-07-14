const jwt = require("jsonwebtoken");
const User = require("../models/users");

const Auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      return res.status(401).send("this user is not Authorized");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

module.exports = Auth;
