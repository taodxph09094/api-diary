const Post = require("../models/postModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const post = await Post.create(req.body);
  res.status(201).json({
    success: true,
    post,
  });
});

exports.getPosts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 31;
  const postCount = await Post.countDocuments();
  const apiFeature = new ApiFeatures(
    Post.find().populate("user", "name"),
    req.query
  ).search();

  let posts = await apiFeature.query;
  let filteredPostsCount = posts.length;
  apiFeature.pagination(resultPerPage);
  posts = await apiFeature.query;
  res.status(200).json({
    success: true,
    posts,
    postCount,
    resultPerPage,
    filteredPostsCount,
  });
});

exports.getPostByUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId; // Lấy ID người dùng từ route parameter
  const resultPerPage = 31;

  const postCount = await Post.countDocuments({ user: userId });

  const apiFeature = new ApiFeatures(
    Post.find({ user: userId }),
    req.query
  ).search();

  let posts = await apiFeature.query;
  let filteredPostsCount = posts.length;
  apiFeature.pagination(resultPerPage);
  posts = await apiFeature.query;
  res.status(200).json({
    success: true,
    posts,
    postCount,
    resultPerPage,
    filteredPostsCount,
  });
});

exports.getPostDetails = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHander("Không tìm thấy nhật ký", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});
