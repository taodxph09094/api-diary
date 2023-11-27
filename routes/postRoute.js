const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  createPost,
  getPosts,
  getPostByUser,
  getPostDetails,
} = require("../controllers/postController");

const router = express.Router();
router.route("/all").get(getPosts);
router.route("/create").post(isAuthenticatedUser, createPost);
router.route("/post-by-user/:userId").get(isAuthenticatedUser, getPostByUser);
router.route("/:id").get(isAuthenticatedUser, getPostDetails);
module.exports = router;
