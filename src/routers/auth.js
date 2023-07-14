const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const Auth = require("../middlewares/Auth");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { password, email, username } = req.body;

    const checkName = await User.findOne({ username });
    if (checkName) {
      return res.status(404).send("This name is already taken");
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(404).send("This email is already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const token = await newUser.createAuthToken();

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).send(newUser);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("This email is not exist");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("The password is invalid!!");
    }
    const token = await user.createAuthToken();
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// LOGOUT
router.post("/logout", Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send("loged out");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
