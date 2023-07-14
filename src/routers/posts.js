const router = require("express").Router();
const Auth = require("../middlewares/Auth");
const Post = require("../models/posts");
const User = require("../models/users");

// CREATE
router.post("/create", Auth, async (req, res) => {
  try {
    const post = await new Post({ userId: req.user._id, ...req.body });
    await post.save();
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// UPDATE
router.patch("/update/:id", Auth, async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Post.findOne({ userId: req.user._id, _id: postID });
    if (!post) {
      return res.status(404).json("you can only update your posts");
    }
    await post.updateOne({ $set: req.body });
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// DELETE
router.delete("/delete/:id", Auth, async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Post.findByIdAndDelete({
      userId: req.user.id,
      _id: postID,
    });
    if (!post) {
      return res.status(404).send("this post not found!!");
    }
    res.status(200).send("The post has been deleted");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
// LIKE
router.patch("/like/:id", Auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send("This post not found!!");
    }
    if (!post.likes.includes(req.user.username)) {
      await post.updateOne({ $push: { likes: req.user.username } });
      res.status(200).send("You have liked the post");
    } else {
      res.status(400).send("you already like this post");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
// DIS LIKE
router.patch("/dislike/:id", Auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send("This post not found!!");
    }
    if (post.likes.includes(req.user.username)) {
      await post.updateOne({ $pull: { likes: req.user.username } });
      res.status(200).send("You have disliked the post");
    } else {
      res.status(400).send("you already not like this post");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// GET POST
router.get("/get/:id", Auth, async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Post.findOne({ _id: postID });
    if (!post) {
      return res.status(404).send("This post not found!!");
    }
    res.status(200).send(post);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// GET TIMELINE POSTS
router.get("/getAll", Auth, async (req, res) => {
  try {
    const allPosts = [];
    const myposts = await Post.find({});
    allPosts.push(myposts);
    req.user.following.every(async (e) => {
      const user = await User.findOne({ username: e });
      const posts = await Post.find({ userId: user._id });
      allPosts.push(posts);
    });
    res.status(200).send(allPosts);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
module.exports = router;
