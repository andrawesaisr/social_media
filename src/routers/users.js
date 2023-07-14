const router = require("express").Router();
const Auth = require("../middlewares/Auth");
const bcrypt = require("bcrypt");
const User = require("../models/users");

//UPDATE A USER
router.put("/update", Auth, async (req, res) => {
  const allowed = [
    "username",
    "password",
    "profilePic",
    "coverPic",
    "desc",
    "city",
    "from",
  ];

  const updates = Object.keys(req.body);

  const result = updates.every((e) => allowed.includes(e));

  if (!result) {
    return res
      .status(400)
      .send("you are not allowed to change a specific info!!");
  }

  try {
    if (req.body.username) {
      const checkName = await User.findOne({ username: req.body.username });
      if (checkName) {
        return res.status(400).send("this name is alreay exist!!");
      }
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.user.password = hashedPassword;
      allowed.forEach((allow) => {
        if (allow !== "password") {
          req.user[allow] = req.body[allow];
        }
      });
    } else {
      allowed.forEach((allow) => {
        req.user[allow] = req.body[allow];
      });
    }

    await req.user.save();

    res.status(200).send("successfully updated");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//DELETE A USER

router.delete("/delete", Auth, async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndDelete(id);
    res.status(200).send("your account has deleted.");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//GET A USER

router.get("/myAccount", Auth, async (req, res) => {
  try {
    const {
      password,
      email,
      tokens,
      createdAt,
      updatedAt,
      __v,
      _id,
      ...others
    } = req.user._doc;

    res.status(200).json(others);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//FOLLOW A USER

router.post("/follow/:name", Auth, async (req, res) => {
  try {
    const name = req.params.name;

    if (req.user.username === name) {
      return res.status(404).send("you can not follow yourself");
    }

    const user = await User.findOne({ username: name });
    if (!user) {
      return res.status(400).send("this user not exist!!");
    }

    if (!req.user.following.includes(name)) {
      /*
      req.user.following=req.user.following.concat(name)
      user.follower=user.follower.concat(req.user.username)
      */
      await req.user.updateOne({ $push: { following: name } });
      await user.updateOne({ $push: { follower: req.user.username } });
    } else {
      return res.status(400).send("you already following this user!");
    }

    res.status(200).send(`you followed ${name}`);
  } catch (e) {
    console.log(e);
    req.status(500).send(e);
  }
});

//UNFOLLOW USER

router.post("/unfollow/:name", Auth, async (req, res) => {
  try {
    const name = req.params.name;

    if (req.user.username === name) {
      return res.status(404).send("you can not unfollow yourself");
    }

    const user = await User.findOne({ username: name });
    if (!user) {
      return res.status(400).send("this user not exist!!");
    }

    if (req.user.following.includes(name)) {
      /*
      req.user.following=req.user.following.filter((follow)=>follow!==name)
      user.follower=user.follower.filter((follow)=>follow!==req.user.username)
      */
      await req.user.updateOne({ $pull: { following: name } });
      await user.updateOne({ $pull: { follower: req.user.username } });
    } else {
      return res.status(400).send("you already unfollowing this user!");
    }

    res.status(200).send(`you unfollowed ${name}`);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
