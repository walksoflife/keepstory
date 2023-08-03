const uploadToCloudinary = require("../helpers/uploader");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const createError = require("http-errors");
const {
  removeLikeNotification,
  createLikeNotification,
} = require("./notificationController");

// ---------------- GET ALL POSTS ORDER DESCENDING ----------------
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username", "avatar", "posts", "followers"])
      .sort({ createdAt: "desc" });

    return res.status(200).json({ message: "Get all posts.", posts });
  } catch (error) {
    return next(error);
  }
};

// ---------------- GET SINGLE POST BY ID ----------------
const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("author", ["username", "avatar", "followers"])
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: ["username", "avatar", "_id"],
        },
      });

    if (!post) throw createError.NotFound();
    return res.status(200).json({ message: "Get single post by id", post });
  } catch (error) {
    return next(error);
  }
};

// ---------------- CREATE NEW POST ----------------
const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const userId = req.user.userId;
    let imageUrl = [];

    if (req.file) {
      imageUrl.push(await uploadToCloudinary(req.file));
    }
    if (req.files) {
      for (let f of req.files) {
        imageUrl.push(await uploadToCloudinary(f));
      }
    }

    if (!caption) throw createError.BadRequest();

    const newPost = await Post.create({
      caption,
      image: imageUrl,
      author: userId,
    });

    const post = await newPost.save();

    await User.findById(userId).then(async (user) => {
      user.posts.push(post);
      await user.save();
    });

    return res.status(200).json({ message: "Post created.", post });
  } catch (error) {
    return next(error);
  }
};

// ---------------- REMOVE POST ----------------
const removePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    let postTmp;

    await Post.findByIdAndDelete(postId).then((post) => {
      postTmp = post;
    });

    await User.findById(userId).then(async (user) => {
      user.posts.pull(postTmp);
      await user.save();
    });

    await Comment.deleteMany({ post: postTmp._id });

    return res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    return next(error);
  }
};

// ---------------- LIKE / UNLIKE A POST ----------------
const createLike = async (req, res, next) => {
  try {
    let message;
    const { postLiked } = req.body;
    const userLiked = req.user.userId;

    const existsUser = await User.findById(userLiked);
    if (!existsUser) throw createError.NotFound();

    await Post.findById(postLiked).then(async (post) => {
      if (!post) throw createError.NotFound();

      if (post.likes.includes(userLiked)) {
        message = "Disliked post.";
        post.likes.pull(userLiked);
        if (post.author._id.toString() !== userLiked.toString()) {
          await removeLikeNotification(userLiked, post.author._id, postLiked);
        }
      } else {
        message = "Liked post.";
        post.likes.push(userLiked);
        if (post.author._id.toString() !== userLiked.toString()) {
          await createLikeNotification(userLiked, post.author._id, postLiked);
        }
      }

      await post.save();
    });
    return res.status(200).json({ message });
  } catch (error) {
    return next(error);
  }
};

// ---------------- BOOKMARK / UN BOOKMARK A POST ----------------
const createBookmark = async (req, res, next) => {
  try {
    let message;
    const { postBookmark } = req.body;
    const userBookmark = req.user.userId;

    const existsUser = await User.findById(userBookmark);
    if (!existsUser) throw createError.NotFound();

    await Post.findById(postBookmark).then(async (post) => {
      if (!post) throw createError.NotFound();

      if (post.bookmarks.includes(userBookmark)) {
        post.bookmarks.pull(userBookmark);
      } else {
        post.bookmarks.push(userBookmark);
      }

      await post.save();
    });

    await User.findById(userBookmark).then(async (user) => {
      if (!user) throw createError.NotFound();

      if (user.bookmarks.includes(postBookmark)) {
        message = "Unsaved post.";
        user.bookmarks.pull(postBookmark);
      } else {
        message = "Saved post.";
        user.bookmarks.push(postBookmark);
      }

      await user.save();
    });
    return res.status(200).json({ message });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createLike,
  removePost,
  createPost,
  getPostById,
  getAllPosts,
  createBookmark,
};
