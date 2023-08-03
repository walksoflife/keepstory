const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const createError = require("http-errors");
const {
  createCommentNotification,
  removeCommentNotification,
} = require("./notificationController");

const createComment = async (req, res, next) => {
  try {
    const { content, post, commentParent, isReply } = req.body;
    const userId = req.user.userId;
    let postTmp;

    if (!content) throw createError.BadRequest();

    const newComment = await Comment.create({
      content,
      author: userId,
      post,
      commentParent,
      isReply,
    });

    const comment = await newComment.save();

    await Post.findById(post).then(async (post) => {
      postTmp = post;
      if (!post) throw createError.NotFound();

      post.comments.push(comment);
      await post.save();
    });

    await User.findById(userId).then(async (user) => {
      if (!user) throw createError.NotFound();

      user.comments.push(comment);
      await user.save();
    });

    if (postTmp.author._id.toString() !== userId.toString()) {
      await createCommentNotification(
        userId,
        postTmp.author._id,
        post,
        comment._id
      );
    }

    return res
      .status(200)
      .json({ message: "Comment has been created.", comment });
  } catch (error) {
    return next(error);
  }
};

const removeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    let commentTmp, postTmp;

    await Comment.findByIdAndDelete(commentId).then((comment) => {
      commentTmp = comment;
    });

    await User.findById(userId).then(async (user) => {
      user.comments.pull(commentTmp);
      await user.save();
    });

    await Post.findById(commentTmp.post).then(async (post) => {
      postTmp = post;
      post.comments.pull(commentTmp);
      await post.save();
    });

    await removeCommentNotification(
      userId,
      postTmp.author,
      commentTmp.post,
      commentTmp._id
    );

    return res.status(200).json({ message: "Comment has been removed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createComment, removeComment };
