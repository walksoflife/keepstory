const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    commentParent: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

module.exports = Comment;
