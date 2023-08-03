const Notification = require("../models/notificationModel");
const createError = require("http-errors");

// ---------------- GET ALL NOTIFICATIONS READ ----------------
const getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany({ receiver: userId }, { read: true });

    const notifications = await Notification.find({ receiver: userId })
      .sort({
        createdAt: "desc",
      })
      .populate("sender", ["username", "avatar"])
      .populate("receiver", ["username", "avatar"])
      .populate("post", ["image"])
      .populate("comment", ["username", "avatar", "content"]);

    return res
      .status(200)
      .json({ message: "Get all notifications", notifications });
  } catch (error) {
    return next(error);
  }
};

// ---------------- SET NOTIFICATION READ ----------------
const unReadNotification = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({
      receiver: userId,
      read: false,
    })
      .sort({
        createdAt: "desc",
      })
      .populate("sender", ["username", "avatar"])
      .populate("receiver", ["username", "avatar"])
      .populate("post", ["image"])
      .populate("comment", ["username", "avatar", "content"]);

    return res
      .status(200)
      .json({ message: "Un read notifications", notifications });
  } catch (error) {
    return next(error);
  }
};

// ---------------- CREATE NOTIFICATION ----------------
const createLikeNotification = async (sender, receiver, post) => {
  try {
    const notification = await Notification.create({
      sender,
      receiver,
      type: "like",
      post,
    });
    await notification.save();
  } catch (error) {
    throw createError.InternalServerError();
  }
};

const removeLikeNotification = async (sender, receiver, post) => {
  try {
    await Notification.findOneAndDelete({
      sender,
      receiver,
      type: "like",
      post,
    });
  } catch (error) {
    throw createError.InternalServerError();
  }
};

const createCommentNotification = async (sender, receiver, post, comment) => {
  try {
    const notification = await Notification.create({
      sender,
      receiver,
      type: "comment",
      post,
      comment,
    });
    await notification.save();
  } catch (error) {
    throw createError.InternalServerError();
  }
};

const removeCommentNotification = async (sender, receiver, post, comment) => {
  try {
    await Notification.findOneAndDelete({
      sender,
      receiver,
      type: "comment",
      post,
      comment,
    });
  } catch (error) {
    throw createError.InternalServerError();
  }
};

const createFollowNotification = async (sender, receiver) => {
  try {
    const notification = await Notification.create({
      sender,
      receiver,
      type: "follow",
    });
    await notification.save();
  } catch (error) {
    throw createError.InternalServerError();
  }
};

const removeFollowNotification = async (sender, receiver) => {
  try {
    await Notification.findOneAndDelete({
      sender,
      receiver,
      type: "follow",
    });
  } catch (error) {
    throw createError.InternalServerError();
  }
};

module.exports = {
  getAllNotifications,
  unReadNotification,
  createLikeNotification,
  removeLikeNotification,
  createCommentNotification,
  removeCommentNotification,
  createFollowNotification,
  removeFollowNotification,
};
