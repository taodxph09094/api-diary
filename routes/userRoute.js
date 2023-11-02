const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  registerUser,
  addFriend,
  loginUser,
  getFriends,
  getAllUser,
  getUserDetails,
} = require("../controllers/userController");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/add-friend/:friendId").put(isAuthenticatedUser, addFriend);
router.route("/friends").get(isAuthenticatedUser, getFriends);
router
  .route("/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/:id").get(isAuthenticatedUser, getUserDetails);
module.exports = router;
