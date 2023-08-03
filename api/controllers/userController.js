const uploadToCloudinary = require("../helpers/uploader");
const User = require("../models/userModel");
const createError = require("http-errors");
const {
  removeFollowNotification,
  createFollowNotification,
} = require("./notificationController");

// ---------------- GET USER BY ID ----------------
const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.find({ username })
      .populate("posts")
      .populate("bookmarks")
      .populate("followers", ["name", "username", "avatar"])
      .populate("followings", ["name", "username", "avatar"])
      .sort({ createdAt: "desc" });

    if (!user) throw createError.NotFound();

    const { password, ...others } = user;
    return res.status(200).json({ message: "Get user by id", user: others });
  } catch (error) {
    return next(error);
  }
};

// ---------------- UPDATE USER ----------------
const updateUser = async (req, res, next) => {
  try {
    const { name, username, email, bio, location } = req.body;

    let avatarUrl;
    if (req.file) {
      avatarUrl = await uploadToCloudinary(req.file);
    }

    const data = {
      name,
      username,
      email,
      bio,
      location,
      avatar: avatarUrl,
    };

    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, data, {
      new: true,
    });

    return res.status(200).json({
      message: "User updated.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// ---------------- FOLLOW USER MAIN ----------------
const followUser = async (req, res, next) => {
  try {
    let message;
    const { friendId } = req.body;
    const userId = req.user.userId;

    if (!friendId || !(await User.findById(friendId)))
      throw createError.NotFound();

    if (userId.toString() === friendId.toString()) throw createError.Conflict();

    let friend = await User.findById(friendId);

    await User.findById(userId).then(async (user) => {
      if (user.followings.includes(friendId)) {
        message = "Unfollowed user.";
        user.followings.pull(friendId);
        friend.followers.pull(userId);
        await removeFollowNotification(userId, friendId);
      } else {
        message = "Followed user.";
        user.followings.push(friendId);
        friend.followers.push(userId);
        await createFollowNotification(userId, friendId);
      }
      await user.save();
      await friend.save();
    });

    return res.status(200).json({ message });
  } catch (error) {
    return next(error);
  }
};

// ---------------- FOLLOW USER ----------------
const flUser = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.userId;

    if (!friendId || !(await User.findById(friendId)))
      throw createError.NotFound();

    if (userId.toString() === friendId.toString()) throw createError.Conflict();

    let friend = await User.findById(friendId);

    await User.findById(userId).then(async (user) => {
      if (!user.followings.includes(friendId)) {
        user.followings.push(friendId);
        friend.followers.push(userId);
        await createFollowNotification(userId, friendId);
      }
      await user.save();
      await friend.save();
    });

    return res.status(200).json({ message: "Followed user." });
  } catch (error) {
    return next(error);
  }
};

// ---------------- UNFOLLOW USER ----------------
const unFlUser = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.userId;

    if (!friendId || !(await User.findById(friendId)))
      throw createError.NotFound();

    if (userId.toString() === friendId.toString()) throw createError.Conflict();

    let friend = await User.findById(friendId);

    await User.findById(userId).then(async (user) => {
      if (user.followings.includes(friendId)) {
        user.followings.pull(friendId);
        friend.followers.pull(userId);
        await removeFollowNotification(userId, friendId);
      }
      await user.save();
      await friend.save();
    });

    return res.status(200).json({ message: "Unfollowed user." });
  } catch (error) {
    return next(error);
  }
};

// ---------------- SEARCH USER ----------------
const searchUser = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;

    const queries = [
      { name: { $regex: keyword, $options: "i" } },
      { username: { $regex: keyword, $options: "i" } },
    ];

    let results = await User.find({ $or: queries })
      .find({ _id: { $ne: req.user.userId } })
      .select(["name", "username", "avatar"]);

    return res.status(200).json({ message: "Results search.", results });
  } catch (error) {
    return next(error);
  }
};

// ---------------- GET LIST FRIENDS ----------------
const getListFriend = async (req, res, next) => {
  try {
    const users = await User.findById({ _id: req.user.userId }).select([
      "followings",
      "followers",
    ]);

    // if (!users) throw createError.NotFound();

    return res.status(200).json({ message: "Get list friends", users });
  } catch (error) {
    return next(error);
  }
};

// ---------------- GET SUGESSTION USER ----------------
const suggestionUser = async (req, res, next) => {
  try {
    let users;
    const user = await User.findById(req.user.userId);
    if (!user) throw createError.NotFound();

    const list = [...user.followings, user._id];

    if (user.followings.length > 0) {
      users = await User.aggregate([
        { $match: { _id: { $nin: list } } },
        { $sample: { size: 5 } },
        { $project: { _id: 1, name: 1, username: 1, avatar: 1 } },
      ]);
    } else users = [];

    return res.status(200).json({ message: "Get suggestion users", users });
  } catch (error) {
    return next(error);
  }
};

// ---------------- GET SUGESSTION USER ----------------
const getUsersFristLogin = async (req, res, next) => {
  try {
    let results;
    const user = await User.findById(req.user.userId);

    if (!user) throw createError.NotFound();
    if (user.followings.length > 0) {
      results = [];
    } else if (user.followings.length === 0) {
      results = await User.aggregate([
        { $match: { _id: { $ne: user._id } } },
        { $sample: { size: 6 } },
        { $project: { _id: 1, name: 1, username: 1, avatar: 1 } },
      ]);
    } else results = [];

    return res.status(200).json({ message: "Get suggestion users", results });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  followUser,
  updateUser,
  getUserByUsername,
  searchUser,
  getListFriend,
  suggestionUser,
  getUsersFristLogin,
  flUser,
  unFlUser,
};
