const express = require("express");

const checkAuth = require("../middlewares/check-auth");
const postsController = require("../controllers/posts");
const extractFile = require("../middlewares/file");

const router = express.Router();

//CREATE POST
router.post("", checkAuth, extractFile, postsController.createPost);

//GET POSTS
router.get("", postsController.getPosts);

//GET POST
router.get("/:id", postsController.getPost);

//UPDATE POST
router.patch("/:id", checkAuth, extractFile, postsController.updatePost);

//DELETE POST
router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
