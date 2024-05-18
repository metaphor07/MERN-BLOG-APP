const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

router.post("/", async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      desc: req.body.desc,
      username: req.body.username,
      category: req.body.category,
      photo: req.body.photo,
    });
    console.log("sv ", newPost);
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// UPDATE THE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(404).json(error);
      }
    } else {
      res.status(401).json("You Con update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE THE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted");
      } catch (error) {
        res.status(404).json(error);
      }
    } else {
      res.status(401).json("You Con Delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET THE POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL THE POST
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ category: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
