const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { username, name, password } = req.body;

  const user = await User.create({
    username,
    name,
    password,
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  // checking if user has given password and email both

  if (!username || !password) {
    return next(new ErrorHander("Nhập mật khẩu", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHander("Sai tài khoản hoặc mật khẩu", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Sai tài khoản hoặc mật khẩu", 401));
  }

  sendToken(user, 200, res);
});
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Đăng xuất",
  });
});

exports.addFriend = catchAsyncErrors(async (req, res, next) => {
  const { friendId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return next(new ErrorHander("Người dùng hoặc bạn bè không tồn tại", 404));
    }

    // Kiểm tra xem bạn bè đã tồn tại trong danh sách bạn bè của người dùng chưa
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Bạn bè đã được thêm" });
  } catch (error) {
    next(error);
  }
});

exports.getFriends = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "name");

    if (!user) {
      return next(new ErrorHander("Người dùng không tồn tại", 404));
    }

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    next(error);
  }
});
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
