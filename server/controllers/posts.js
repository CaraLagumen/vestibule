const Post = require("../models/post");

exports.createPost = async (req, res, next) => {
  // const url = `${req.protocol}://${req.get("host")}`;
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    // imagePath: `${url}/images/${req.file.filename}`,,
    imagePath: `/images/${req.file.filename}`,
    creator: req.userData.userId
  });

  // post.save();
  res.status(201).json({
    status: "success",
    post
  });
};

exports.getPosts = async (req, res, next) => {
  // const posts = [
  //   { id: "1", title: "title1", content: "content1" },
  //   { id: "2", title: "title2", content: "content2" }
  // ];

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  const postCount = await Post.countDocuments();
  const posts = await postQuery;

  res.status(200).json({
    status: "success",
    posts,
    maxPosts: postCount
  });
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404).json({ message: "Post not found!" });
  }

  res.status(200).json(post);
  //WON'T WORK IF
  // res.status(200).json({
  //   status: `success`,
  //   post
  // }); ???
};

exports.updatePost = async (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    // const url = `${req.protocol}://${req.get("host")}`;
    // imagePath = `${url}/images/${req.file.filename}`;
    imagePath = `/images/${req.file.filename}`;
  }

  // const post = await Post.findByIdAndUpdate(
  //   req.params.id,
  //   req.body
  // );

  const post = await Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    {
      id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    }
  );

  if (!post) {
    res.status(404).json({ message: "Post not found!" });
  }

  if (post.n > 0) {
    res.status(200).json({
      status: `success`,
      post
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }
};

exports.deletePost = async (req, res, next) => {
  const post = await Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  });

  if (!post) {
    res.status(404).json({ message: "Post not found!" });
  }

  if (post.n > 0) {
    res.status(204).json({
      status: `success`,
      post: null
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }
};
